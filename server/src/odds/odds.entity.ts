import { Bets } from 'src/bets/bets.entity';
import { Fixtures } from 'src/fixtures/fixtures.entities';
import { Leagues } from 'src/leagues/leagues.entity';
import { OddValues } from 'src/odd-values/odd-values.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';

@Entity('odds')
export class Odds {
  @PrimaryColumn()
  id: number;

  @Column()
  leagueId: number;

  @ManyToOne(() => Leagues)
  @JoinColumn({ name: 'leagueId' })
  league: Leagues;

  @Column()
  fixtureId: number;

  @Column()
  betId: number;

  @ManyToOne(() => Fixtures)
  @JoinColumn({ name: 'fixtureId' })
  fixture: Fixtures;

  @ManyToOne(() => Bets)
  @JoinColumn({ name: 'betId' })
  bet: Bets;

  @OneToMany(() => OddValues, (oddValue) => oddValue.odds)
  oddValues: OddValues[];
}
