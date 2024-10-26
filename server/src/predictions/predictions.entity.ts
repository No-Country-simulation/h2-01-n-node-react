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

  @Column({ nullable: true })
  points: number;

  @Column()
  betId: number;
  @ManyToOne(() => Bets, (bet) => bet.id)
  @JoinColumn({ name: 'betId' })
  bet: Bets;

  @Column()
  userId: number;
  @ManyToOne(() => Users)
  @JoinColumn({ name: 'userId' })
  user: Users;

  @Column()
  fixtureId: number;
  @ManyToOne(() => Fixtures, (fixture) => fixture.id)
  @JoinColumn({ name: 'fixtureId' })
  fixture: Fixtures;

  @Column({ nullable: true })
  aggregatePredictionId: number;
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
