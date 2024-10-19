import { FixtureBets } from 'src/fixture-bets/fixture-bets.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity('fixture_bet_odds')
export class FixtureBetOdds {
  @PrimaryColumn()
  fixtureBetId: number;

  @PrimaryColumn()
  value: string;

  @Column()
  odd: string;

  @ManyToOne(() => FixtureBets, (fixtureBets) => fixtureBets.fixtureBetOdds)
  @JoinColumn({ name: 'fixtureBetId' })
  fixtureBet: FixtureBets;
}
