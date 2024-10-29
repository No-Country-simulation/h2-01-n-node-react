import { Exclude } from 'class-transformer';
import Ranks from 'src/ranks/ranks.entities';
import { USER_RANK, USER_ROLE } from 'src/types';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('users')
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: false })
  @Exclude()
  password: string;

  @Column({
    type: 'enum',
    enum: USER_ROLE,
    default: USER_ROLE.USER,
    nullable: false,
  })
  role: USER_ROLE;

  @Column()
  rank: string;
  @ManyToOne(() => Ranks, (rank) => rank.users)
  @JoinColumn({ name: 'rank', referencedColumnName: 'name' })
  rankInfo: Ranks;

  @Column({ type: 'integer', default: 0, nullable: false })
  points: number;

  @Column({ nullable: true })
  image: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: false,
  })
  createdAt: Date;
}
