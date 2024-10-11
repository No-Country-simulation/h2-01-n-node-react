import { Exclude } from 'class-transformer';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum USER_ROLE {
  USER = 'User',
  PREMIUM = 'Premium',
  ADMIN = 'Admin',
}

export enum USER_RANK {
  BRONZE = 'Bronze',
  SILVER = 'Silver',
  GOLD = 'Gold',
}

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

  @Column({
    type: 'enum',
    enum: USER_RANK,
    default: USER_RANK.BRONZE,
    nullable: false,
  })
  rank: USER_RANK;

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
