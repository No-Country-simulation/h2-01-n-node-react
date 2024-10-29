import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('bets')
export class Bets {
  @PrimaryColumn()
  id: number;

  @Column()
  name: string;
}
