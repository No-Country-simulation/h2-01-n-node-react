import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Fixtures } from './fixtures.entities';
import { Repository } from 'typeorm';
import { FixturesPaginationDTO } from './dtos/pagination.dto';

@Injectable()
export class FixturesService {
  constructor(
    @InjectRepository(Fixtures)
    private fixturesRepository: Repository<Fixtures>,
  ) {}

  async findAll(query: FixturesPaginationDTO) {
    const { date, timezone } = query;

    const queryBuilder = this.fixturesRepository
      .createQueryBuilder('fixture')
      .leftJoinAndSelect('fixture.venue', 'venue')
      .leftJoinAndSelect('fixture.league', 'league')
      .leftJoinAndSelect('fixture.homeTeam', 'homeTeam')
      .leftJoinAndSelect('fixture.awayTeam', 'awayTeam')
      .leftJoinAndSelect(
        'fixture.fixtureBets',
        'fixtureBet',
        '(fixtureBet.betId = :betId OR fixtureBet.id IS NULL)',
        { betId: 1 },
      )
      .leftJoinAndSelect('fixtureBet.fixtureBetOdds', 'fixtureBetOdd');

    if (date && timezone) {
      const localDate = new Date(date);
      const utcDate = new Date(
        localDate.toLocaleString('en-US', { timeZone: timezone }),
      );

      const startOfDay = new Date(utcDate);
      startOfDay.setUTCHours(0, 0, 0, 0);

      const endOfDay = new Date(utcDate);
      endOfDay.setUTCHours(23, 59, 59, 999);

      endOfDay.setUTCMinutes(
        endOfDay.getUTCMinutes() + new Date().getTimezoneOffset(),
      );

      queryBuilder.andWhere(
        'fixture.date >= :startOfDay AND fixture.date <= :endOfDay',
        { startOfDay, endOfDay },
      );
    }

    queryBuilder.andWhere(
      '(fixtureBet.betId = :betId OR fixtureBet.id IS NULL)',
      { betId: 1 },
    );

    return await queryBuilder.getMany();
  }

  async findOneById(id: number) {
    return await this.fixturesRepository
      .createQueryBuilder('fixture')
      .leftJoinAndSelect('fixture.venue', 'venue')
      .leftJoinAndSelect('fixture.league', 'league')
      .leftJoinAndSelect('fixture.homeTeam', 'homeTeam')
      .leftJoinAndSelect('fixture.awayTeam', 'awayTeam')
      .leftJoinAndSelect(
        'fixture.fixtureBets',
        'fixtureBet',
        'fixtureBet.betId IN (:...betIds) OR fixtureBet.id IS NULL',
        {
          betIds: [1, 92],
        },
      )
      .leftJoinAndSelect('fixtureBet.fixtureBetOdds', 'fixtureBetOdd')
      .where('fixture.id = :id', { id })
      .getOne();
  }
}
