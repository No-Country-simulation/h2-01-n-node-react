import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { TokensService } from './tokens.service';

@ApiTags('Tokens')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Controller('tokens')
export class TokensController {
  constructor(private tokensService: TokensService) {}

  @Get()
  findAll() {
    return this.tokensService.findAll();
  }

  @Get(':rank')
  findManyByRank(@Param('rank') rank: string) {
    return this.tokensService.findManyByRank(rank);
  }
}
