import { FixtureBets } from 'src/fixture-bets/fixture-bets.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('fixture_bet_odds')
export class FixtureBetOdds {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fixtureBetId: number;

  @Column()
  value: string;

  @Column()
  odd: string;

  @ManyToOne(() => FixtureBets, (fixtureBets) => fixtureBets.fixtureBetOdds)
  @JoinColumn({ name: 'fixtureBetId' })
  fixtureBet: FixtureBets;
}
