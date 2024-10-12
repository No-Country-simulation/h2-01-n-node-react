import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Venues } from './venues.entity';
import { Repository } from 'typeorm';
import { Countries } from 'src/countries/countries.entity';

// TODO: check to replace with countries service
@Injectable()
export class VenuesService {
  constructor(
    @InjectRepository(Venues)
    private venuesRepository: Repository<Venues>,
    @InjectRepository(Countries)
    private countriesRepository: Repository<Countries>,
  ) {}

  async findAll() {
    return await this.venuesRepository.find();
  }

  async findOneById(id: number) {
    const venue = await this.venuesRepository.findOneBy({ id });

    if (!venue) throw new NotFoundException('Venue not found');

    return venue;
  }

  async findManyByCountryName(name: string) {
    const country = await this.countriesRepository.findOneBy({
      name: name,
    });

    if (!country) throw new NotFoundException('Country not found');

    const venues = await this.venuesRepository.find({
      where: { country: country.name },
    });

    return venues;
  }
}
