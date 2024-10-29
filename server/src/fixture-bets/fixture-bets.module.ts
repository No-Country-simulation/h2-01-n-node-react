import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FixtureBets } from './fixture-bets.entity';
import { Fixtures } from 'src/fixtures/fixtures.entities';
import { Bets } from 'src/bets/bets.entity';
import { Leagues } from 'src/leagues/leagues.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FixtureBets, Fixtures, Bets, Leagues])],
})
export class FixtureBetsModule {}
