import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Leagues } from './leagues.entity';
import { Repository } from 'typeorm';
import { CountriesService } from 'src/countries/countries.service';

@Injectable()
export class LeaguesService {
  constructor(
    @InjectRepository(Leagues)
    private leaguesRepository: Repository<Leagues>,
    private countriesService: CountriesService,
  ) {}

  async findAll() {
    return await this.leaguesRepository.find({
      relations: ['country'],
    });
  }

  async findOneById(id: number) {
    const league = await this.leaguesRepository.findOne({
      where: { id },
      relations: ['country', 'seasons'],
    });

    if (!league) throw new NotFoundException('League not found');

    return league;
  }

  async findManyByCountryName(name: string) {
    const country = await this.countriesService.findOneByName(name);

    const leagues = await this.leaguesRepository.find({
      where: { country: { name: country.name } },
      relations: ['country'],
    });

    return leagues;
  }

  async findManyByType(type: string) {
    const leagues = await this.leaguesRepository.find({
      where: { type },
      relations: ['country'],
    });

    return leagues;
  }

  // TODO: check
  async findAllWithActiveSeasons() {
    return await this.leaguesRepository
      .createQueryBuilder('league')
      .leftJoinAndSelect('league.country', 'country')
      .leftJoinAndSelect(
        'league.seasons',
        'season',
        'season.current = :current',
        { current: true },
      )
      // .where('season.id IS NOT NULL')
      .getMany();
  }
}
