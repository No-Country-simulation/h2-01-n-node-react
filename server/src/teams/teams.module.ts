import { Module } from '@nestjs/common';
import { TeamsController } from './teams.controller';
import { TeamsService } from './teams.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Teams } from './teams.entity';
import { Venues } from 'src/venues/venues.entity';
import { CountriesModule } from 'src/countries/countries.module';
import { PlayerTeamRelationships } from 'src/player-team-relationships/player-team-relationships.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Teams, Venues, PlayerTeamRelationships]),
    CountriesModule,
  ],
  controllers: [TeamsController],
  providers: [TeamsService],
})
export class TeamsModule {}
