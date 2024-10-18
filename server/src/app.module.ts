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

@Module({
  imports: [
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
  ],
  controllers: [AppController],
})
export class AppModule {}
