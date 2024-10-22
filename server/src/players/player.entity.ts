import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('players')
export class Players {
  @PrimaryColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  age: number;

  @Column({ nullable: true })
  number: number;

  @Column()
  position: string;

  @Column()
  photo: string;
}
