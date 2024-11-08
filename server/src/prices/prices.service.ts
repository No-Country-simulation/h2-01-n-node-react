import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Prices } from './prices.entity';
import { ILike, Repository } from 'typeorm';
import { UpdatePriceDTO } from './dtos/update.dto';

@Injectable()
export class PricesService {
  constructor(
    @InjectRepository(Prices)
    private pricesRepository: Repository<Prices>,
  ) {}

  async findAll() {
    const prices = await this.pricesRepository.find();

    return { prices };
  }

  async findOneById(id: number) {
    const price = await this.pricesRepository.findOne({ where: { id } });

    if (!price) throw new NotFoundException('Price not found');

    return { price };
  }

  async findOneByName(name: string) {
    const price = await this.pricesRepository.findOne({
      where: { name: ILike(name) },
    });

    if (!price) throw new NotFoundException('Price not found');

    return { price };
  }

  async updateOne(id: number, updatePriceDto: UpdatePriceDTO) {
    const price = await this.pricesRepository.findOne({ where: { id } });

    if (!price) throw new NotFoundException('Price not found');

    Object.assign(price, updatePriceDto);

    await this.pricesRepository.save(price);

    return { price };
  }
}
