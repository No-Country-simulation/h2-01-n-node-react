import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { envConfig } from './config';
import { configSchema } from './config/joi.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { CountriesModule } from './countries/countries.module';
import { VenuesModule } from './venues/venues.module';
import { LeaguesModule } from './leagues/leagues.module';
import { TeamsModule } from './teams/teams.module';
import { LeagueSeasonsModule } from './league-seasons/league-seasons.module';
import { TeamStatisticsModule } from './team-statistics/team-statistics.module';
import { FixturesModule } from './fixtures/fixtures.module';
import { BetsModule } from './bets/bets.module';
import { FixtureBetsModule } from './fixture-bets/fixture-bets.module';
import { FixtureBetOddsModule } from './fixture-bet-odds/fixture-bet-odds.module';
import { PlayersModule } from './players/players.module';
import { PlayerTeamRelationshipsModule } from './player-team-relationships/player-team-relationships.module';
import { ScheduleModule } from '@nestjs/schedule';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      load: [envConfig],
      validationSchema: configSchema,
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('postgresHost'),
        port: configService.get<number>('postgresPort'),
        username: configService.get<string>('postgresUser'),
        password: configService.get<string>('postgresPassword'),
        database: configService.get<string>('postgresDb'),
        autoLoadEntities: true,
        synchronize: configService.get<string>('environment') !== 'prod', // synchronize se establece en true solo si NODE_ENV no es 'prod'
      }),
    }),
    HttpModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      global: true,
      useFactory: async (configService: ConfigService) => ({
        baseURL: configService.get<string>('apiBaseUrl'),
        headers: {
          [configService.get<string>('apiHeaderFieldName')]:
            configService.get<string>('apiKey'),
        },
      }),
    }),
    UsersModule,
    AuthModule,
    CountriesModule,
    VenuesModule,
    LeaguesModule,
    TeamsModule,
    LeagueSeasonsModule,
    TeamStatisticsModule,
    FixturesModule,
    BetsModule,
    FixtureBetsModule,
    FixtureBetOddsModule,
    PlayersModule,
    PlayerTeamRelationshipsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
