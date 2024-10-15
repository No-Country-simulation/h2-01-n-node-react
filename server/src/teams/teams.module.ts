import { Module } from '@nestjs/common';
import { TeamsController } from './teams.controller';
import { TeamsService } from './teams.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Teams } from './teams.entity';
import { Venues } from 'src/venues/venues.entity';
import { CountriesModule } from 'src/countries/countries.module';

@Module({
  imports: [TypeOrmModule.forFeature([Teams, Venues]), CountriesModule],
  controllers: [TeamsController],
  providers: [TeamsService],
})
export class TeamsModule {}
