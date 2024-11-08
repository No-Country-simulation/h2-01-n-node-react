import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RankReset } from './rank-reset.entity';
import { RankResetController } from './rank-reset.controller';
import { RankResetService } from './rank-reset.service';

@Module({
  imports: [TypeOrmModule.forFeature([RankReset])],
  controllers: [RankResetController],
  providers: [RankResetService],
})
export class RankResetModule {}
