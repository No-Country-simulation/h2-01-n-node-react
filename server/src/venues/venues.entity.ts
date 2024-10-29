import { Countries } from 'src/countries/countries.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity('venues')
export class Venues {
  @PrimaryColumn()
  id: number;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  city: string;

  @ManyToOne(() => Countries, { nullable: false })
  @JoinColumn({ name: 'country' })
  country: Countries;

  @Column({ nullable: true })
  capacity: number;

  @Column({ nullable: true })
  surface: string;

  @Column({ nullable: true })
  image: string;
}
