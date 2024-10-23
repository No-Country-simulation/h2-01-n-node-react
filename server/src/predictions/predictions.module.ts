import { Module } from '@nestjs/common';
import { PredictionsService } from './predictions.service';
import { PredictionsController } from './predictions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Predictions } from './predictions.entity';
import { AggregatePredictions } from 'src/aggregate-predictions/aggregate-predictions.entity';
import { Bets } from 'src/bets/bets.entity';
import { Fixtures } from 'src/fixtures/fixtures.entities';
import { Users } from 'src/users/users.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Predictions,
      AggregatePredictions,
      Bets,
      Fixtures,
      Users,
    ]),
  ],
  providers: [PredictionsService],
  controllers: [PredictionsController],
})
export class PredictionsModule {}
