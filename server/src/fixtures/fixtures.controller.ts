import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { FixturesService } from './fixtures.service';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { FixturesPaginationDTO } from './dtos/pagination.dto';

@ApiTags('Fixtures')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('fixtures')
export class FixturesController {
  constructor(private fixturesService: FixturesService) {}

  @Get()
  @ApiQuery({
    name: 'date',
    required: false,
    type: String,
    description: 'ISO 8601 date string (e.g. 2024-10-13)',
  })
  @ApiQuery({
    name: 'timezone',
    required: false,
    type: String,
    description:
      'Time zone string (e.g. America/Argentina/Buenos_Aires). Default: America/Argentina/Buenos_Aires',
  })
  findAll(@Query() query: FixturesPaginationDTO) {
    query.applyDefaults();
    return this.fixturesService.findAll(query);
  }

  @Get(':id')
  findOneById(@Param('id') id: string) {
    return this.fixturesService.findOneById(+id);
  }
}
