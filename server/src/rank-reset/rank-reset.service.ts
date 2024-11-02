import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RankReset } from './rank-reset.entity';
import { Repository } from 'typeorm';
import { DateTime } from 'luxon';

@Injectable()
export class RankResetService {
  constructor(
    @InjectRepository(RankReset)
    private rankResetRepository: Repository<RankReset>,
  ) {}

  async findAll() {
    const rankResets = await this.rankResetRepository.find();

    return { rankResets };
  }

  async findOneById(id: number) {
    const rankReset = await this.rankResetRepository.findOne({ where: { id } });

    if (!rankReset) throw new NotFoundException('Rank reset not found');

    return { rankReset };
  }

  async updateRankResetDate(id: number, date: string) {
    let rankReset = await this.rankResetRepository.findOne({ where: { id } });

    if (!rankReset) throw new NotFoundException('Rank reset not found');

    rankReset.resetDate = DateTime.fromISO(date, {
      zone: 'America/Argentina/Buenos_Aires',
    }).toJSDate();

    const updatedRankReset = await this.rankResetRepository.save(rankReset);

    return { rankReset: updatedRankReset };
  }
}
