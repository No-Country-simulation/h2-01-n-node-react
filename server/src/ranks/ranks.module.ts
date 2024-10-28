import { Module } from '@nestjs/common';
import { RanksService } from './ranks.service';
import { RanksController } from './ranks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import Ranks from './ranks.entities';

@Module({
  imports: [TypeOrmModule.forFeature([Ranks])],
  providers: [RanksService],
  controllers: [RanksController],
})
export class RanksModule {}
