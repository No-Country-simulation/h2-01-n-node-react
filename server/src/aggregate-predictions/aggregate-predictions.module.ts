import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AggregatePredictions } from './aggregate-predictions.entity';
import { Users } from 'src/users/users.entity';
import { Predictions } from 'src/predictions/predictions.entity';
import { Fixtures } from 'src/fixtures/fixtures.entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AggregatePredictions,
      Predictions,
      Users,
      Fixtures,
    ]),
  ],
})
export class AggregatePredictionsModule {}
