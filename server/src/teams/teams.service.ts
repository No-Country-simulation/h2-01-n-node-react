import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Teams } from './teams.entity';
import { CountriesService } from 'src/countries/countries.service';

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(Teams)
    private teamsRepository: Repository<Teams>,
    private countriesService: CountriesService,
  ) {}

  async findAll() {
    const teams = await this.teamsRepository.find({
      relations: ['country'],
    });

    return { teams };
  }

  async findOneById(id: number) {
    const team = await this.teamsRepository.findOne({
      where: { id },
      relations: ['country', 'venue'],
    });

    if (!team) throw new NotFoundException('Team not found');

    return { team };
  }

  async findManyByCountryName(name: string) {
    const { country } = await this.countriesService.findOneByName(name);

    const leagues = await this.teamsRepository.find({
      where: { country: { name: country.name } },
      relations: ['country'],
    });

    return { leagues };
  }
}
