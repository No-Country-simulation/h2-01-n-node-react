import { Countries } from 'src/countries/countries.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity('leagues')
export class Leagues {
  @PrimaryColumn()
  id: number;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  type: string;

  @Column({ nullable: true })
  logo: string;

  @ManyToOne(() => Countries, { nullable: false })
  @JoinColumn({ name: 'country' })
  @Column({ nullable: false })
  country: string;
}
