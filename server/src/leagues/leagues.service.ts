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
    return await this.leaguesRepository.find();
  }

  async findOneById(id: number) {
    const league = await this.leaguesRepository.findOne({
      where: { id },
      relations: ['seasons'],
    });

    if (!league) throw new NotFoundException('Country not found');

    return league;
  }

  async findManyByCountryName(name: string) {
    const country = await this.countriesService.findOneByName(name);

    const leagues = await this.leaguesRepository.find({
      where: { country: country.name },
    });

    return leagues;
  }

  async findManyByType(type: string) {
    const leagues = await this.leaguesRepository.find({
      where: { type },
    });

    return leagues;
  }

  async findAllWithActiveSeasons() {
    return await this.leaguesRepository
      .createQueryBuilder('league')
      .leftJoinAndSelect(
        'league.seasons',
        'season',
        'season.current = :current',
        { current: true },
      )
      .where('season.id IS NOT NULL')
      .getMany();
  }
}
