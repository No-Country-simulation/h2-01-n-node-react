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
    return await this.fixturesRepository.find({
      relations: [
        'venue',
        'league',
        'homeTeam',
        'awayTeam',
        'fixtureBets',
        'fixtureBets.fixtureBetOdds',
      ],
    });
  }

  async findOneById(id: number) {
    return await this.fixturesRepository.findOne({
      where: { id },
      relations: [
        'venue',
        'league',
        'homeTeam',
        'awayTeam',
        'fixtureBets',
        'fixtureBets.fixtureBetOdds',
      ],
    });
  }
}
