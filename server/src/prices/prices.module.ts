import { Module } from '@nestjs/common';
import { PricesController } from './prices.controller';
import { PricesService } from './prices.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Prices } from './prices.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Prices])],
  controllers: [PricesController],
  providers: [PricesService],
})
export class PricesModule {}
