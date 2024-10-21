import { Leagues } from 'src/leagues/leagues.entity';
import { Entity, Column, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';

@Entity('league_seasons')
export class LeagueSeasons {
  @PrimaryColumn()
  year: number;

  @PrimaryColumn()
  leagueId: number;

  @Column()
  start: Date;

  @Column()
  end: Date;

  @Column()
  current: boolean;

  @ManyToOne(() => Leagues, (league) => league.seasons, { nullable: false })
  @JoinColumn({ name: 'leagueId' })
  league: Leagues;
}
