import { Module } from '@nestjs/common';
import { LeaguesController } from './leagues.controller';
import { LeaguesService } from './leagues.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Leagues } from './leagues.entity';
import { CountriesModule } from 'src/countries/countries.module';

@Module({
  imports: [TypeOrmModule.forFeature([Leagues]), CountriesModule],
  controllers: [LeaguesController],
  providers: [LeaguesService],
  exports: [LeaguesService],
})
export class LeaguesModule {}
