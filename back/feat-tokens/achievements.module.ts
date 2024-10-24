import { Module } from '@nestjs/common';
import { AchievementsController } from './achievements.controller';
import { AchievementsService } from './achievements.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Achievements } from './achievements.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Achievements])],
  controllers: [AchievementsController],
  providers: [AchievementsService],
  exports: [AchievementsService],
})
export class AchievementsModule {}
