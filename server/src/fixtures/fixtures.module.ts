import { Module } from '@nestjs/common';
import { FixturesController } from './fixtures.controller';
import { FixturesService } from './fixtures.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Fixtures } from './fixtures.entities';
import { Odds } from 'src/odds/odds.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Fixtures, Odds])],
  controllers: [FixturesController],
  providers: [FixturesService],
})
export class FixturesModule {}
