import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Players } from './player.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Players])],
})
export class PlayersModule {}
