import { Module } from '@nestjs/common';
import { FixturesController } from './fixtures.controller';
import { FixturesService } from './fixtures.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Fixtures } from './fixtures.entities';
import { FixtureBets } from 'src/fixture-bets/fixture-bets.entity';
import { FixtureBetOdds } from 'src/fixture-bet-odds/fixture-bet-odds.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Fixtures, FixtureBets, FixtureBetOdds])],
  controllers: [FixturesController],
  providers: [FixturesService],
})
export class FixturesModule {}
