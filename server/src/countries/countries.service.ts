import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Countries } from './countries.entity';

@Injectable()
export class CountriesService {
  constructor(
    @InjectRepository(Countries)
    private countriesRepository: Repository<Countries>,
  ) {}

  async findAll() {
    const countries = await this.countriesRepository.find();

    return { countries };
  }

  async findOneByName(name: string) {
    const country = await this.countriesRepository.findOneBy({ name });

    if (!country) throw new NotFoundException('Country not found');

    return { country };
  }
}
