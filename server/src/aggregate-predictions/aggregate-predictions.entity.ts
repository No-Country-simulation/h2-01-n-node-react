import { Notifications } from 'src/notifications/notifications.entity';
import { Predictions } from 'src/predictions/predictions.entity';
import { PREDICTION_STATUS } from 'src/types';
import { Users } from 'src/users/users.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('aggregate_predictions')
export class AggregatePredictions {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: PREDICTION_STATUS,
    default: PREDICTION_STATUS.PENDING,
    nullable: false,
  })
  status: PREDICTION_STATUS;

  @Column({ nullable: true })
  points: number;

  @Column()
  userId: number;
  @ManyToOne(() => Users, (user) => user.id)
  @JoinColumn({ name: 'userId' })
  user: Users;

  @OneToMany(() => Predictions, (prediction) => prediction.aggregatePrediction)
  predictions: Predictions[];

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: false,
  })
  createdAt: Date;

  @OneToMany(() => Notifications, (notification) => notification.prediction)
  notifications: Notifications[];
}
