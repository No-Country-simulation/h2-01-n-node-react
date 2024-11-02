import { Module } from '@nestjs/common';
import { RanksService } from './ranks.service';
import { RanksController } from './ranks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import Ranks from './ranks.entities';
import { Users } from 'src/users/users.entity';
import { RankReset } from 'src/rank-reset/rank-reset.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Ranks, Users, RankReset])],
  providers: [RanksService],
  controllers: [RanksController],
})
export class RanksModule {}
