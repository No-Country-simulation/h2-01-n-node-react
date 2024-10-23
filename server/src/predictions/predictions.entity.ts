import { AggregatePredictions } from 'src/aggregate-predictions/aggregate-predictions.entity';
import { Bets } from 'src/bets/bets.entity';
import { Fixtures } from 'src/fixtures/fixtures.entities';
import { PREDICTION_STATUS } from 'src/types';
import { Users } from 'src/users/users.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('predictions')
export class Predictions {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  value: string;

  @Column()
  odd: string;

  @Column({
    type: 'enum',
    enum: PREDICTION_STATUS,
    default: PREDICTION_STATUS.PENDING,
    nullable: false,
  })
  status: PREDICTION_STATUS;

  @ManyToOne(() => Bets, (bet) => bet.id)
  @JoinColumn({ name: 'betId' })
  bet: Bets;

  @ManyToOne(() => Users, (user) => user.id)
  @JoinColumn({ name: 'userId' })
  user: Users;

  @ManyToOne(() => Fixtures, (fixture) => fixture.id)
  @JoinColumn({ name: 'fixtureId' })
  fixture: Fixtures;

  @ManyToOne(
    () => AggregatePredictions,
    (aggregatePrediction) => aggregatePrediction.predictions,
    { nullable: true },
  )
  @JoinColumn({ name: 'aggregatePredictionId' })
  aggregatePrediction: AggregatePredictions;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: false,
  })
  createdAt: Date;
}
