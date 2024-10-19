import { Module } from '@nestjs/common';
import { FixturesController } from './fixtures.controller';
import { FixturesService } from './fixtures.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Fixtures } from './fixtures.entities';
import { FixtureBets } from 'src/fixture-bets/fixture-bets.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Fixtures, FixtureBets])],
  controllers: [FixturesController],
  providers: [FixturesService],
})
export class FixturesModule {}
