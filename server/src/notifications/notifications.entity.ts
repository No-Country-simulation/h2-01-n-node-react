import { AggregatePredictions } from 'src/aggregate-predictions/aggregate-predictions.entity';
import { Fixtures } from 'src/fixtures/fixtures.entities';
import { Predictions } from 'src/predictions/predictions.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('notifications')
export class Notifications {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  message: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ default: false })
  read: boolean;

  @Column({ nullable: true })
  fixtureId?: number;

  @Column({ nullable: true })
  predictionId?: number;

  @Column({ nullable: true })
  aggregatePredictionId?: number;

  @ManyToOne(() => Fixtures, (fixture) => fixture.notifications, {
    nullable: true,
  })
  @JoinColumn({ name: 'fixtureId' })
  fixture?: Fixtures;

  @ManyToOne(() => Predictions, (prediction) => prediction.notifications, {
    nullable: true,
  })
  @JoinColumn({ name: 'predictionId' })
  prediction?: Predictions;

  @ManyToOne(
    () => AggregatePredictions,
    (aggregate) => aggregate.notifications,
    { nullable: true },
  )
  @JoinColumn({ name: 'aggregatePredictionId' })
  aggregatePrediction?: AggregatePredictions;
}
