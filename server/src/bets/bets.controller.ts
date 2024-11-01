import { Controller, Get, UseGuards } from '@nestjs/common';
import { BetsService } from './bets.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@ApiTags('Bets')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Controller('bets')
export class BetsController {
  constructor(private betsService: BetsService) {}

  @Get()
  findAll() {
    return this.betsService.findAll();
  }
}
