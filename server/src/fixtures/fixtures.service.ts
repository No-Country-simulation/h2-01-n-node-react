import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Fixtures } from './fixtures.entities';
import { Repository } from 'typeorm';

@Injectable()
export class FixturesService {
  constructor(
    @InjectRepository(Fixtures)
    private fixturesRepository: Repository<Fixtures>,
  ) {}

  async findAll() {
    return await this.fixturesRepository
      .createQueryBuilder('fixture')
      .leftJoinAndSelect('fixture.venue', 'venue')
      .leftJoinAndSelect('fixture.league', 'league')
      .leftJoinAndSelect('fixture.homeTeam', 'homeTeam')
      .leftJoinAndSelect('fixture.awayTeam', 'awayTeam')
      .leftJoinAndSelect('fixture.fixtureBets', 'fixtureBet')
      .leftJoinAndSelect('fixtureBet.fixtureBetOdds', 'fixtureBetOdd')
      .where('fixtureBet.betId = :betId', { betId: 1 })
      .getMany();
  }

  async findOneById(id: number) {
    return await this.fixturesRepository
      .createQueryBuilder('fixture')
      .leftJoinAndSelect('fixture.venue', 'venue')
      .leftJoinAndSelect('fixture.league', 'league')
      .leftJoinAndSelect('fixture.homeTeam', 'homeTeam')
      .leftJoinAndSelect('fixture.awayTeam', 'awayTeam')
      .leftJoinAndSelect('fixture.fixtureBets', 'fixtureBet')
      .leftJoinAndSelect('fixtureBet.fixtureBetOdds', 'fixtureBetOdd')
      .where('fixture.id = :id', { id })
      .andWhere('fixtureBet.betId IN (:...betIds)', { betIds: [1, 215] })
      .getOne();
  }
}
