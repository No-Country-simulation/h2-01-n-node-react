import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tokens } from './tokens.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TokensService {
  constructor(
    @InjectRepository(Tokens)
    private tokensRepository: Repository<Tokens>,
  ) {}

  async findAll() {
    const tokens = await this.tokensRepository.find({
      order: {
        released: 'DESC',
      },
    });

    return { tokens };
  }

  async findManyByRank(rank: string) {
    const tokens = await this.tokensRepository
      .createQueryBuilder('token')
      .where('LOWER(token.rank) = :rank', { rank: rank.toLowerCase() })
      .orderBy('token.released', 'DESC')
      .getMany();

    return { tokens };
  }
}
