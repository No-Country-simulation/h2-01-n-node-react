import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tokens } from './tokens.entity';
import { TokensService } from './tokens.service';
import { TokensController } from './tokens.controller';
import Ranks from 'src/ranks/ranks.entities';

@Module({
  imports: [TypeOrmModule.forFeature([Tokens, Ranks])],
  providers: [TokensService],
  controllers: [TokensController],
})
export class TokensModule {}
