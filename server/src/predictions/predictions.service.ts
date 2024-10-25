import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Predictions } from './predictions.entity';
import { Repository } from 'typeorm';
import { AggregatePredictions } from 'src/aggregate-predictions/aggregate-predictions.entity';
import { CreatePredictionDTO } from './dtos/create-prediction.dto';
import { Fixtures } from 'src/fixtures/fixtures.entities';
import { DateTime } from 'luxon';
import { PredictionsPaginationDTO } from './dtos/pagination.dto';
import { CreateAggregatePredictionDTO } from './dtos/create-aggregate.dto';

@Injectable()
export class PredictionsService {
  constructor(
    @InjectRepository(Predictions)
    private predictionsRepository: Repository<Predictions>,
    @InjectRepository(AggregatePredictions)
    private aggregatePredictionsRepository: Repository<AggregatePredictions>,
    @InjectRepository(Fixtures)
    private fixturesRepository: Repository<Fixtures>,
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
}
