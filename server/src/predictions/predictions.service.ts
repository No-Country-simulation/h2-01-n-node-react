import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Predictions } from './predictions.entity';
import { Repository } from 'typeorm';
import { AggregatePredictions } from 'src/aggregate-predictions/aggregate-predictions.entity';
import { CreatePredictionDTO } from './dtos/create-prediction.dto';

@Injectable()
export class PredictionsService {
  constructor(
    @InjectRepository(Predictions)
    private predictionsRepository: Repository<Predictions>,
    @InjectRepository(AggregatePredictions)
    private aggregatePredictionsRepository: Repository<AggregatePredictions>,
  ) {}

  async findAllPredictionsByUserId(id: number) {
    return this.predictionsRepository.find({
      where: { user: { id }, aggregatePrediction: null },
    });
  }

  async createPrediction(
    createPredictionDto: CreatePredictionDTO,
    userId: number,
  ) {}
}
