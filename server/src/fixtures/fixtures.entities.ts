import { LeagueSeasons } from 'src/league-seasons/league-seasons.entity';
import { Leagues } from 'src/leagues/leagues.entity';
import { Odds } from 'src/odds/odds.entity';
import { Teams } from 'src/teams/teams.entity';
import { Venues } from 'src/venues/venues.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';

@Entity('fixtures')
export class Fixtures {
  @PrimaryColumn()
  id: number;

  @Column({ nullable: true })
  referee: string | null;

  @Column()
  timezone: string;

  @Column()
  date: Date;

  @Column()
  timestamp: number;

  @Column({ nullable: true })
  firstPeriod: number | null;

  @Column({ nullable: true })
  secondPeriod: number | null;

  @ManyToOne(() => Venues, { nullable: false })
  @JoinColumn({ name: 'venueId' })
  venue: Venues;

  @Column()
  statusLong: string;

  @Column()
  statusShort: string;

  @Column({ nullable: true })
  statusElapsed: number | null;

  @Column({ nullable: true })
  statusExtra: number | null;

  @ManyToOne(() => Leagues, { nullable: false })
  @JoinColumn({ name: 'leagueId' })
  league: Leagues;

  @Column()
  season: number;

  @Column()
  round: string;

  @ManyToOne(() => Teams, { nullable: false })
  @JoinColumn({ name: 'homeTeamId' })
  homeTeam: Teams;

  @ManyToOne(() => Teams, { nullable: false })
  @JoinColumn({ name: 'awayTeamId' })
  awayTeam: Teams;

  @Column({ nullable: true })
  homeTeamWinner: boolean | null;

  @Column({ nullable: true })
  awayTeamWinner: boolean | null;

  @Column({ nullable: true })
  homeGoals: number | null;

  @Column({ nullable: true })
  awayGoals: number | null;

  @Column({ nullable: true })
  homeScoreHalftime: number | null;

  @Column({ nullable: true })
  awayScoreHalftime: number | null;

  @Column({ nullable: true })
  homeScoreFulltime: number | null;

  @Column({ nullable: true })
  awayScoreFulltime: number | null;

  @Column({ nullable: true })
  homeScoreExtratime: number | null;

  @Column({ nullable: true })
  awayScoreExtratime: number | null;

  @Column({ nullable: true })
  homeScorePenalty: number | null;

  @Column({ nullable: true })
  awayScorePenalty: number | null;

  @OneToMany(() => Odds, (odds) => odds.fixture)
  odds: Odds[];
}
