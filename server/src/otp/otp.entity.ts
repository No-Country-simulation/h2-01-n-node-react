import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Users } from '../users/users.entity';

@Entity()
export class OTP {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  code: string;

  @Column({ default: false })
  used: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  expiresAt: Date;

  @ManyToOne(() => Users, user => user.otps)
  @JoinColumn({ name: 'userId' })
  user: Users;
}