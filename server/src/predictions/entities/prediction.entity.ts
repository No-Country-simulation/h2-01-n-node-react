import { IsEnum } from 'class-validator';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

export enum PREDICTION_STATUS {
  ACCEPTED = 'ACCEPTED',
  SUCCESS = 'SUCCESS',
  FAILURE = 'FAILURE',
  CANCELLED = 'CANCELLED'
}

@Entity('predictions')
export class Prediction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  homeScore: string;

  @Column({ nullable: false })
  awayScore: string;

  @Column({ nullable: false })
  userId: string;

  @Column({ nullable: false })
  fixtureId: string;

  @Column({ default: false })
  isDraw: boolean;

  @Column({ default: PREDICTION_STATUS.ACCEPTED })
  status: PREDICTION_STATUS;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: false,
  })
  createdAt: Date;
}
