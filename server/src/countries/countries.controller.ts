import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { CountriesService } from './countries.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CountryNameDTO } from 'src/dtos/country-name.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@ApiTags('Countries')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Controller('countries')
export class CountriesController {
  constructor(private countriesService: CountriesService) {}

  @Get()
  findAll() {
    return this.countriesService.findAll();
  }

  @Get(':name')
  findOneByName(@Param('name') name: string) {
    const dto = new CountryNameDTO(name);
    return this.countriesService.findOneByName(dto.name);
  }
}
