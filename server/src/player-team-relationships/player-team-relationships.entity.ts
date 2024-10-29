import { LeagueSeasons } from 'src/league-seasons/league-seasons.entity';
// import { Leagues } from 'src/leagues/leagues.entity';
import { Players } from 'src/players/player.entity';
import { Teams } from 'src/teams/teams.entity';
import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity('player_team_relationships')
export class PlayerTeamRelationships {
  @PrimaryColumn()
  playerId: number;

  @PrimaryColumn()
  teamId: number;

  @PrimaryColumn()
  leagueId: number;

  @PrimaryColumn()
  leagueSeason: number;

  @ManyToOne(() => Players)
  @JoinColumn({ name: 'playerId' })
  player: Players;

  @ManyToOne(() => Teams)
  @JoinColumn({ name: 'teamId' })
  team: Teams;

  @ManyToOne(() => LeagueSeasons)
  @JoinColumn([
    { name: 'leagueId', referencedColumnName: 'leagueId' },
    { name: 'leagueSeason', referencedColumnName: 'year' },
  ])
  season: LeagueSeasons;
}
