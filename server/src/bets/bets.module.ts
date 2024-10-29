import { Module, UseGuards } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bets } from './bets.entity';
import { BetsService } from './bets.service';
import { BetsController } from './bets.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Bets])],
  controllers: [BetsController],
  providers: [BetsService],
  exports: [BetsService],
})
export class BetsModule {}
