import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { RanksService } from './ranks.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@ApiTags('Ranks')
@ApiBearerAuth()
@UseGuards(RolesGuard)
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
