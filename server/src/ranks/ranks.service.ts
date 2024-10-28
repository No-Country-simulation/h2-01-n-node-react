import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Ranks from './ranks.entities';
import { Repository } from 'typeorm';

@Injectable()
export class RanksService {
  constructor(
    @InjectRepository(Ranks)
    private ranksRepository: Repository<Ranks>,
  ) {}

  async findAll() {
    return await this.ranksRepository.find();
  }

  async findOneByName(name: string) {
    const rank = await this.ranksRepository
      .createQueryBuilder('rank')
      .leftJoinAndSelect('rank.users', 'user')
      .where('rank.name = :rankName', {
        rankName: name.charAt(0).toUpperCase() + name.slice(1),
      })
      .select(['rank', 'user.id', 'user.username', 'user.image', 'user.points'])
      .orderBy('user.points', 'DESC')
      .getOne();

    return rank;
  }
}
