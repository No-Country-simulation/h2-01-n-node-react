import { Controller, Get, UseGuards } from '@nestjs/common';
import { BetsService } from './bets.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@ApiTags('Bets')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('bets')
export class BetsController {
  constructor(private betsService: BetsService) {}

  @Get()
  findAll() {
    return this.betsService.findAll();
  }
}
