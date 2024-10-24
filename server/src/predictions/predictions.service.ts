import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Predictions } from './predictions.entity';
import { Between, Repository } from 'typeorm';
import { AggregatePredictions } from 'src/aggregate-predictions/aggregate-predictions.entity';
import { CreatePredictionDTO } from './dtos/create-prediction.dto';
import { Fixtures } from 'src/fixtures/fixtures.entities';
import { DateTime } from 'luxon';

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

    let maxPredictions = isSameDay ? 5 : 2;

    const startOfDay = isSameDay
      ? createdAt.startOf('day').toJSDate()
      : fixtureDate.startOf('day').toJSDate();

    const endOfDay = isSameDay
      ? createdAt.endOf('day').toJSDate()
      : fixtureDate.endOf('day').toJSDate();

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
        `Maximum ${maxPredictions} predictions allowed for ${createdAt.toISO()}`,
      );
    }

    return await this.predictionsRepository.save({
      ...createPredictionDto,
      userId,
      createdAt: createdAt.toISO(),
    });
  }

  // async createAggregatePrediction(
  //   createPredictionDto: CreatePredictionDTO,
  //   userId: number,
  // ) {}

  async findAllPredictionsByUserId(userId: number) {
    return await this.predictionsRepository.find({
      where: { userId, aggregatePrediction: null },
    });
  }

  async findAllAggregatePredictionsByUserId(id: number) {
    return await this.aggregatePredictionsRepository.find({
      where: { user: { id } },
    });
  }

  async findAllByUserId(id: number) {
    const predictions = await this.predictionsRepository.find({
      where: {
        user: { id },
        aggregatePrediction: null,
      },
    });

    const aggregatePredictions = await this.aggregatePredictionsRepository.find(
      {
        where: { user: { id } },
      },
    );

    return { predictions, aggregatePredictions };
  }

  async findAllByFixtureIdAndUserId(fixtureId: number, userId: number) {
    const predictions = await this.predictionsRepository.find({
      where: {
        fixture: { id: fixtureId },
        user: { id: userId },
        aggregatePrediction: null,
      },
    });

    const aggregatePredictions = await this.aggregatePredictionsRepository.find(
      {
        where: { fixture: { id: fixtureId }, user: { id: userId } },
      },
    );

    return { predictions, aggregatePredictions };
  }
}
