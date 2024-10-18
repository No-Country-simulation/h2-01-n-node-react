import { Odds } from 'src/odds/odds.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('odd_values')
export class OddValues {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  oddId: number;

  @Column()
  value: string;

  @Column()
  odd: string;

  @ManyToOne(() => Odds, (odds) => odds.oddValues)
  @JoinColumn({ name: 'oddId' })
  odds: Odds;
}
