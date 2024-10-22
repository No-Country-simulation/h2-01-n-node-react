import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Bets } from './bets.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BetsService {
  constructor(
    @InjectRepository(Bets)
    private betsRepository: Repository<Bets>,
  ) {}

  async findAll() {
    return await this.betsRepository.find();
  }
}