import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FixtureBetOdds } from './fixture-bet-odds.entity';
import { FixtureBets } from 'src/fixture-bets/fixture-bets.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FixtureBetOdds, FixtureBets])],
})
export class FixtureBetOddsModule {}
