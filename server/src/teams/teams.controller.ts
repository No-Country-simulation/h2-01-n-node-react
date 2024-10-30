import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { TeamsService } from './teams.service';
import { CountryNameDTO } from 'src/dtos/country-name.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@ApiTags('Teams')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Controller('teams')
export class TeamsController {
  constructor(private teamsService: TeamsService) {}

  @Get()
  findAll() {
    return this.teamsService.findAll();
  }

  @Get(':id')
  findOneById(@Param('id') id: string) {
    return this.teamsService.findOneById(+id);
  }

  @Get('country/:name')
  findManyByCountryName(@Param('name') name: string) {
    const dto = new CountryNameDTO(name);
    return this.teamsService.findManyByCountryName(dto.name);
  }
}
