import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Predictions } from './predictions.entity';
import { EntityManager, Repository } from 'typeorm';
import { AggregatePredictions } from 'src/aggregate-predictions/aggregate-predictions.entity';
import { CreatePredictionDTO } from './dtos/create-prediction.dto';
import { Fixtures } from 'src/fixtures/fixtures.entities';
import { DateTime } from 'luxon';
import { PredictionsPaginationDTO } from './dtos/pagination.dto';
import { CreateAggregatePredictionDTO } from './dtos/create-aggregate.dto';
import { Cron } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import { catchError, firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { AxiosError } from 'axios';
import { formatFixtures } from 'src/util/format';
import { PREDICTION_STATUS } from 'src/types';

@Injectable()
export class PredictionsService {
  constructor(
    @InjectRepository(Predictions)
    private predictionsRepository: Repository<Predictions>,
    @InjectRepository(AggregatePredictions)
    private aggregatePredictionsRepository: Repository<AggregatePredictions>,
    @InjectRepository(Fixtures)
    private fixturesRepository: Repository<Fixtures>,
    private configService: ConfigService,
    private httpService: HttpService,
    @InjectEntityManager() private readonly entityManager: EntityManager,
  ) {}

  // TODO: update to fetch bet from api to get updated odds before creating
  async createPrediction(
    createPredictionDto: CreatePredictionDTO,
    userId: number,
  ) {
    const fixture = await this.fixturesRepository.findOne({
      where: { id: createPredictionDto.fixtureId },
    });

    const notAllowedStatuses = ['FT', 'AET', 'PEN'];

    if (!fixture) throw new NotFoundException('Fixture not found');
    if (notAllowedStatuses.includes(fixture.statusShort))
      throw new BadRequestException(
        'Predictions cannot be placed after the fixture has ended',
      );

    const createdAt = DateTime.now().setZone('America/Argentina/Buenos_Aires');
    const fixtureDate = DateTime.fromJSDate(fixture.date).setZone(
      'America/Argentina/Buenos_Aires',
    );

    const isSameDay = createdAt.hasSame(fixtureDate, 'day');
    const maxPredictions = isSameDay ? 5 : 2;
    const date = isSameDay ? createdAt : fixtureDate;

    const startOfDay = date.startOf('day').toJSDate();
    const endOfDay = date.endOf('day').toJSDate();

    const existingPredictionsCount = await this.predictionsRepository
      .createQueryBuilder('prediction')
      .innerJoin('prediction.fixture', 'fixture')
      .where('prediction.userId = :userId', { userId })
      .andWhere('fixture.date >= :startOfDay', {
        startOfDay,
      })
      .andWhere('fixture.date <= :endOfDay', { endOfDay })
      .getCount();

    if (existingPredictionsCount >= maxPredictions) {
      throw new BadRequestException(
        `Maximum ${maxPredictions} predictions allowed for ${date.toFormat('yyyy-MM-dd')}`,
      );
    }

    return await this.predictionsRepository.save({
      ...createPredictionDto,
      userId,
      createdAt: createdAt.toISO(),
    });
  }

  async createAggregatePrediction(
    createAggregatePredictionDto: CreateAggregatePredictionDTO,
    userId: number,
  ) {
    const { predictions } = createAggregatePredictionDto;
    const notAllowedStatuses = ['FT', 'AET', 'PEN'];
    const fixturesMap = new Map<string, DateTime>();
    for (const prediction of predictions) {
      const fixture = await this.fixturesRepository.findOne({
        where: { id: prediction.fixtureId },
      });
      if (!fixture)
        throw new NotFoundException(
          `Fixture with id ${prediction.fixtureId} not found`,
        );
      if (notAllowedStatuses.includes(fixture.statusShort))
        throw new BadRequestException(
          `Predictions cannot be placed after the fixture with id ${fixture.id} has ended`,
        );
      const fixtureDate = DateTime.fromJSDate(fixture.date).setZone(
        'America/Argentina/Buenos_Aires',
      );

      fixturesMap.set(fixture.id.toString(), fixtureDate);
    }

    const createdAt = DateTime.now().setZone('America/Argentina/Buenos_Aires');

    const { totalPredictionsPerDate } =
      await this.countUserPredictionsForNextWeek(userId);

    const newPredictionsCountByDate = new Map<string, number>();

    for (const fixtureDate of fixturesMap.values()) {
      const dateKey = fixtureDate.toFormat('yyyy-MM-dd');

      if (!newPredictionsCountByDate.has(dateKey)) {
        newPredictionsCountByDate.set(dateKey, 0);
      }

      newPredictionsCountByDate.set(
        dateKey,
        newPredictionsCountByDate.get(dateKey) + 1,
      );
    }

    for (const [dateKey, newCount] of newPredictionsCountByDate.entries()) {
      const existingCount =
        totalPredictionsPerDate.find((d) => d.date === dateKey)?.count || 0;
      const totalCount = existingCount + newCount;

      const isSameDay = createdAt.hasSame(DateTime.fromISO(dateKey), 'day');
      const maxPredictions = isSameDay ? 5 : 2;

      if (totalCount > maxPredictions) {
        throw new BadRequestException(
          `Maximum ${maxPredictions} predictions reached for ${dateKey}. You already have ${existingCount} predictions plus ${newCount} being added.`,
        );
      }
    }

    const aggregatePrediction = await this.aggregatePredictionsRepository.save({
      userId,
    });

    return await this.predictionsRepository.save(
      predictions.map((prediction) => ({
        ...prediction,
        aggregatePredictionId: aggregatePrediction.id,
        userId,
        createdAt: createdAt.toISO(),
      })),
    );
  }

  async findSinglePredictionById(id: number) {
    const prediction = await this.predictionsRepository.findOne({
      where: { id },
      relations: ['fixture'],
    });

    if (!prediction) throw new NotFoundException('Single prediction not found');

    return { prediction };
  }

  async findAggregatePredictionById(id: number) {
    const aggregatePrediction =
      await this.aggregatePredictionsRepository.findOne({
        where: { id },
        relations: ['predictions', 'predictions.fixture'],
      });

    if (!aggregatePrediction)
      throw new NotFoundException('Aggregate prediction not found');

    return { aggregatePrediction };
  }

  async findAllByUserId(userId: number, query: PredictionsPaginationDTO) {
    const { type } = query;
    let predictions = [];
    let aggregatePredictions = [];
    if (type === 'SINGLE' || type !== 'AGGREGATE') {
      const p = await this.predictionsRepository.find({
        where: { userId, aggregatePrediction: null },
        relations: ['fixture'],
      });
      predictions = [...p];
    }
    if (type === 'AGGREGATE' || type !== 'SINGLE') {
      const a = await this.aggregatePredictionsRepository.find({
        where: { userId },
        relations: ['predictions', 'predictions.fixture'],
      });
      aggregatePredictions = [...a];
    }

    return { predictions, aggregatePredictions };
  }

  async countUserPredictionsForNextWeek(userId: number) {
    const today = DateTime.now()
      .startOf('day')
      .setZone('America/Argentina/Buenos_Aires');
    const endOfWeek = today.plus({ days: 6 }).endOf('day');

    const predictions = await this.predictionsRepository
      .createQueryBuilder('prediction')
      .innerJoinAndSelect('prediction.fixture', 'fixture')
      .where('prediction.userId = :userId', { userId })
      .andWhere('fixture.date >= :startOfWeek', {
        startOfWeek: today.toJSDate(),
      })
      .andWhere('fixture.date <= :endOfWeek', {
        endOfWeek: endOfWeek.toJSDate(),
      })
      .select(['prediction', 'fixture.date'])
      .getMany();

    const totalPredictionsPerDate = [];

    for (let i = 0; i < 7; i++) {
      const date = today.plus({ days: i }).toFormat('yyyy-MM-dd');

      totalPredictionsPerDate.push({
        date,
        count: predictions.filter(
          (p) =>
            DateTime.fromJSDate(p.fixture.date)
              .setZone('America/Argentina/Buenos_Aires')
              .startOf('day')
              .toFormat('yyyy-MM-dd') === date,
        ).length,
      });
    }

    return { totalPredictionsPerDate };
  }

  async findAllByFixtureIdAndUserId(fixtureId: number, userId: number) {
    const predictions = await this.predictionsRepository.find({
      where: {
        fixture: { id: fixtureId },
        user: { id: userId },
      },
      relations: ['aggregatePrediction'],
    });

    return { predictions };
  }

  async findAllSinglePredictionsByFixtureId(fixtureId: number) {
    const predictions = await this.predictionsRepository
      .createQueryBuilder('prediction')
      .where('prediction.aggregatePredictionId IS NULL')
      .andWhere('prediction.fixtureId = :fixtureId', { fixtureId })
      .getMany();

    return { predictions };
  }

  async findAllPendingAggregatePredictionsByFixtureId(fixtureId: number) {
    const aggregatePredictions = await this.aggregatePredictionsRepository
      .createQueryBuilder('aggregatePrediction')
      .where('aggregatePrediction.status = :status', {
        status: PREDICTION_STATUS.PENDING,
      })
      .andWhere((qb) => {
        const subQuery = qb
          .subQuery()
          .select('1')
          .from('predictions', 'p')
          .where('p.fixtureId = :fixtureId', { fixtureId })
          .andWhere('p.aggregatePredictionId = aggregatePrediction.id')
          .getQuery();

        return 'EXISTS ' + subQuery;
      })
      .leftJoinAndSelect('aggregatePrediction.predictions', 'prediction')
      .getMany();

    return { aggregatePredictions };
  }

  @Cron('45 9-23 * * *', {
    timeZone: 'America/Argentina/Buenos_Aires',
  })
  async solvePredictionsOfRecentlyCompletedFixtures() {
    if (!this.configService.get<string>('apiKey')) return;
    console.log('solvePredictionsOfRecentlyCompletedFixtures running');

    const timezone = 'America/Argentina/Buenos_Aires';

    const today = DateTime.now().setZone(timezone);

    const startOfDay = today.startOf('day').toUTC();
    const endOfToday = today.endOf('day').toUTC();

    const finishedStatuses = ['FT', 'AET', 'PEN'];

    try {
      // obtain fixtures that ended today from external api
      const { data } = await firstValueFrom(
        this.httpService
          .get(
            `fixtures?date=${startOfDay.toFormat('yyyy-MM-dd')}&league=128&season=2024&timezone=America%2FArgentina%2FBuenos_Aires&status=FT-AET-PEN`,
          )
          .pipe(
            catchError((error: AxiosError) => {
              console.log(error);
              throw 'An error happened!';
            }),
          ),
      );

      const externalFixtures = data.response;
      if (externalFixtures.length === 0) return;

      // obtain fixtures that haven't been marked done today from db
      const fixtures = await this.fixturesRepository
        .createQueryBuilder('fixture')
        .where('fixture.date BETWEEN :startDate AND :endDate', {
          startDate: startOfDay.toJSDate(),
          endDate: endOfToday.toJSDate(),
        })
        .andWhere('fixture.leagueId = :leagueId', { leagueId: 128 })
        .andWhere('fixture.statusShort NOT IN (:...finishedStatuses)', {
          finishedStatuses,
        })
        .leftJoinAndSelect('fixture.fixtureBets', 'fixtureBets')
        .leftJoinAndSelect('fixtureBets.fixtureBetOdds', 'fixtureBetOdds')
        .getMany();

      const formattedExternalFixtures = formatFixtures(externalFixtures);

      // save to db
      const fixturesToBeCompleted = [];

      // save to db
      const usersPoints = new Map<number, number>();

      for (const eFixture of formattedExternalFixtures) {
        const fixtureToBeCompleted = fixtures.find((f) => f.id === eFixture.id);
        // solve each fixture
        if (fixtureToBeCompleted) {
          try {
            fixturesToBeCompleted.push(eFixture);
            // obtain all single predictions
            const { predictions } =
              await this.findAllSinglePredictionsByFixtureId(
                fixtureToBeCompleted.id,
              );
            // obtain all aggregate predictions predictions
            const { aggregatePredictions } =
              await this.findAllPendingAggregatePredictionsByFixtureId(
                fixtureToBeCompleted.id,
              );
            // winning value
            let winningValue: string;
            if (eFixture.homeTeamWinner) {
              winningValue = 'Home';
            } else if (eFixture.awayTeamWinner) {
              winningValue = 'Away';
            } else {
              winningValue = 'Draw';
            }

            // solve predictions
            predictions.forEach((prediction) => {
              const isPredictionCorrect = prediction.value === winningValue;
              if (isPredictionCorrect) {
                prediction.status = PREDICTION_STATUS.WON;
                const predictionPoints = parseFloat(prediction.odd) * 10;
                prediction.points = predictionPoints;
                if (!usersPoints.has(prediction.userId)) {
                  usersPoints.set(prediction.userId, predictionPoints);
                } else {
                  usersPoints.set(
                    prediction.userId,
                    usersPoints.get(prediction.userId) + predictionPoints,
                  );
                }
              } else {
                prediction.status = PREDICTION_STATUS.LOST;
              }
            });

            // save to db
            const predictionsToSave = [...predictions];

            aggregatePredictions.forEach((aggregate) => {
              let predictionOddsResult = 1;
              aggregate.predictions.forEach((prediction) => {
                predictionOddsResult =
                  predictionOddsResult * parseFloat(prediction.odd);
                if (prediction.fixtureId === fixtureToBeCompleted.id) {
                  const isPredictionCorrect = prediction.value === winningValue;
                  prediction.status = isPredictionCorrect
                    ? PREDICTION_STATUS.WON
                    : PREDICTION_STATUS.LOST;
                  predictionsToSave.push(prediction);
                }
              });

              // if one prediction is lost, set aggregate to lost
              if (
                aggregate.predictions.some(
                  (prediction) => prediction.status === PREDICTION_STATUS.LOST,
                )
              ) {
                aggregate.status = PREDICTION_STATUS.LOST;
              } else if (
                aggregate.predictions.every(
                  (prediction) => prediction.status === PREDICTION_STATUS.WON,
                )
              ) {
                aggregate.status = PREDICTION_STATUS.WON;
                const aggregatePoints =
                  predictionOddsResult * (10 * aggregate.predictions.length);
                aggregate.points = aggregatePoints;
                if (!usersPoints.has(aggregate.userId)) {
                  usersPoints.set(aggregate.userId, aggregatePoints);
                } else {
                  usersPoints.set(
                    aggregate.userId,
                    usersPoints.get(aggregate.userId) + aggregatePoints,
                  );
                }
              }
              delete aggregate.predictions;
            });

            await this.entityManager.transaction(
              async (transactionManager: EntityManager) => {
                await transactionManager.save(Predictions, predictionsToSave);

                await transactionManager.save(
                  AggregatePredictions,
                  aggregatePredictions,
                );
              },
            );
          } catch (error: any) {
            console.error(
              `Error while solving fixture ${eFixture.id}: ${error}`,
            );
            throw error;
          }
        }
        await this.entityManager.transaction(
          async (transactionManager: EntityManager) => {
            if (usersPoints.size > 0) {
              const updates = Array.from(usersPoints.entries())
                .map(([userId, points]) => {
                  return `WHEN id = ${userId} THEN points + ${points}`;
                })
                .join(' ');

              const userIds = Array.from(usersPoints.keys()).join(', ');

              await transactionManager.query(`
          UPDATE users
          SET points = CASE
            ${updates}
          END
          WHERE id IN (${userIds})
        `);
            }

            await transactionManager.save(Fixtures, fixturesToBeCompleted);
          },
        );
      }
    } catch (error: any) {
      console.log(
        `Error when solving predictions of recently completed fixtures: ${error}`,
      );
    }
  }
}
