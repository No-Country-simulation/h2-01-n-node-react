import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { RanksService } from './ranks.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@ApiTags('Ranks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('ranks')
export class RanksController {
  constructor(private ranksService: RanksService) {}

  @Get()
  findAll() {
    return this.ranksService.findAll();
  }

  @Get(':name')
  findOneByName(@Param('name') name: string) {
    return this.ranksService.findOneByName(name);
  }
}
