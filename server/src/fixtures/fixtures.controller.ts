import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { FixturesService } from './fixtures.service';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { FixturesPaginationDTO } from './dtos/pagination.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@ApiTags('Fixtures')
@ApiBearerAuth()
@UseGuards(RolesGuard)
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
  @ApiQuery({
    name: 'order',
    required: false,
    type: String,
    description:
      'Order direction for date sorting. Allowed values: asc, ASC, desc, DESC.',
    enum: ['asc', 'ASC', 'desc', 'DESC'],
  })
  findAll(@Query() query: FixturesPaginationDTO) {
    const { timezone } = query;
    if (!timezone) query.timezone = 'America/Argentina/Buenos_Aires';
    return this.fixturesService.findAll(query);
  }

  @Get(':id')
  findOneById(@Param('id') id: string) {
    return this.fixturesService.findOneById(+id);
  }
}
