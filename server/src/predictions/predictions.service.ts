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
import { PredictionsPaginationDTO } from './dtos/pagination.dto';

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

  // async createAggregatePrediction(
  //   createPredictionDto: CreatePredictionDTO,
  //   userId: number,
  // ) {}

  async findAllByUserId(userId: number, query: PredictionsPaginationDTO) {
    const { type } = query;
    let predictions = [];
    let aggregatePredictions = [];
    if (type === 'SINGLE' || type !== 'AGGREGATE') {
      const p = await this.predictionsRepository.find({
        where: { userId, aggregatePrediction: null },
      });
      predictions = [...p];
    }
    if (type === 'AGGREGATE' || type !== 'SINGLE') {
      const a = await this.aggregatePredictionsRepository.find({
        where: { userId },
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
