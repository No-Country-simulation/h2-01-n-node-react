import { Fixtures } from 'src/fixtures/fixtures.entities';
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

  @ManyToOne(() => Users, (user) => user.id)
  @JoinColumn({ name: 'userId' })
  user: Users;

  @ManyToOne(() => Fixtures, (fixture) => fixture.id)
  @JoinColumn({ name: 'fixtureId' })
  fixture: Fixtures;

  @OneToMany(() => Predictions, (prediction) => prediction.aggregatePrediction)
  predictions: Predictions[];

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: false,
  })
  createdAt: Date;
}
