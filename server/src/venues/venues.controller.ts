import { Body, Controller, Get, Param, UseGuards } from '@nestjs/common';
import { VenuesService } from './venues.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CountryNameDTO } from 'src/dtos/country-name.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@ApiTags('Venues')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Controller('venues')
export class VenuesController {
  constructor(private venuesService: VenuesService) {}

  @Get()
  findAll() {
    return this.venuesService.findAll();
  }

  @Get(':id')
  findOneById(@Param('id') id: string) {
    return this.venuesService.findOneById(+id);
  }

  @Get('country/:name')
  findManyByCountryName(@Param('name') name: string) {
    const dto = new CountryNameDTO(name);
    return this.venuesService.findManyByCountryName(dto.name);
  }
}
