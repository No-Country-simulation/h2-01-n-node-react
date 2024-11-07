import { Tokens } from 'src/tokens/tokens.entity';
import { Users } from 'src/users/users.entity';
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';

@Entity('ranks')
export default class Ranks {
  @PrimaryColumn()
  name: string;

  @Column({ nullable: true })
  bottomLimit: number;

  @Column({ nullable: true })
  topLimit: number;

  @OneToMany(() => Users, (user) => user.rankInfo)
  users: Users[];

  @OneToMany(() => Tokens, (token) => token.rankInfo)
  tokens: Tokens[];
}
