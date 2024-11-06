import { Users } from 'src/users/users.entity';
import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity('orders')
export class Orders {
  @PrimaryColumn({ type: 'bigint' })
  id: number;

  @Column()
  userId: number;

  @Column()
  amount: number;

  @Column()
  detail: string;

  @ManyToOne(() => Users, (user) => user.orders)
  @JoinColumn({ name: 'userId' })
  user: Users;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: false,
  })
  createdAt: Date;
}
