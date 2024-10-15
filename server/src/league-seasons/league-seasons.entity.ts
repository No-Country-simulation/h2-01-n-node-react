import { Exclude } from 'class-transformer';
import { Leagues } from 'src/leagues/leagues.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('league_seasons')
export class LeagueSeasons {
  @PrimaryGeneratedColumn()
  @Exclude()
  id: number;

  @Column()
  year: number;

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
