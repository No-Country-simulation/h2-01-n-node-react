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
    return await this.countriesRepository.find();
  }

  async findOneByName(name: string) {
    const country = await this.countriesRepository.findOneBy({ name });

    if (!country) throw new NotFoundException('Country not found');

    return country;
  }
}
