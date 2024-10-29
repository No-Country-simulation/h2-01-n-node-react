import { Module } from '@nestjs/common';
import { Leagues } from 'src/leagues/leagues.entity';
import { LeagueSeasons } from './league-seasons.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Leagues, LeagueSeasons])],
})
export class LeagueSeasonsModule {}
