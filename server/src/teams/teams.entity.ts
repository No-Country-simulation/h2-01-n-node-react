import { Countries } from 'src/countries/countries.entity';
import { Venues } from 'src/venues/venues.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';

@Entity('teams')
export class Teams {
  @PrimaryColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  code: string;

  @ManyToOne(() => Countries, { nullable: false })
  @JoinColumn({ name: 'country' })
  country: Countries;

  @Column()
  founded: number;

  @Column()
  national: boolean;

  @Column()
  logo: string;

  @OneToOne(() => Venues, { nullable: true })
  @JoinColumn({ name: 'venueId' })
  venue: Venues | null;
}
