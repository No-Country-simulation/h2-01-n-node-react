import { IsInt, Max, Min } from 'class-validator';
import Ranks from 'src/ranks/ranks.entities';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('tokens')
export class Tokens {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column('int', { default: 0, nullable: false })
  @IsInt()
  @Min(0)
  @Max(100000)
  released: number;

  @Column({ nullable: true })
  rank: string;
  @ManyToOne(() => Ranks, (rank) => rank.tokens)
  @JoinColumn({ name: 'rank', referencedColumnName: 'name' })
  rankInfo: Ranks;
}
