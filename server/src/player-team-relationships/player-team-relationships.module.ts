import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeagueSeasons } from 'src/league-seasons/league-seasons.entity';
import { PlayerTeamRelationships } from './player-team-relationships.entity';
import { Leagues } from 'src/leagues/leagues.entity';
import { Players } from 'src/players/player.entity';
import { Teams } from 'src/teams/teams.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PlayerTeamRelationships,
      Leagues,
      LeagueSeasons,
      Players,
      Teams,
    ]),
  ],
})
export class PlayerTeamRelationshipsModule {}
