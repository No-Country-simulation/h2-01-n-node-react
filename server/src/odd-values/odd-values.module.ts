import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Odds } from 'src/odds/odds.entity';
import { OddValues } from './odd-values.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OddValues, Odds])],
})
export class OddValuesModule {}
