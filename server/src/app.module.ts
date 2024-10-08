import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { envConfig } from './config';
import { configSchema } from './config/joi.config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [envConfig],
      validationSchema: configSchema,
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
        synchronize: configService.get<string>('NODE_ENV') !== 'prod', // synchronize se establece en true solo si NODE_ENV no es 'prod'
      }),
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
