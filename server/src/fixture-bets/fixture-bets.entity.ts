import { Bets } from 'src/bets/bets.entity';
import { FixtureBetOdds } from 'src/fixture-bet-odds/fixture-bet-odds.entity';
import { Fixtures } from 'src/fixtures/fixtures.entities';
import { Leagues } from 'src/leagues/leagues.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';

@Entity('fixture_bets')
export class FixtureBets {
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

  @OneToMany(() => FixtureBetOdds, (fixtureBetOdd) => fixtureBetOdd.fixtureBet)
  fixtureBetOdds: FixtureBetOdds[];
}
