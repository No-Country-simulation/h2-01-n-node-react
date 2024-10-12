import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('countries')
export class Countries {
  @PrimaryColumn()
  name: string;

  @Column({ nullable: true })
  code: string;

  @Column({ nullable: true })
  flag: string;
}
