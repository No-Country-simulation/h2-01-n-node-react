import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('rank_reset')
export class RankReset {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  resetDate: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
