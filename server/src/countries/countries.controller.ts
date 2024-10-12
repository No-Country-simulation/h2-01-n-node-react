import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { CountriesService } from './countries.service';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { CountryNameDTO } from 'src/dtos/country-name.dto';

@ApiTags('Countries')
@ApiCookieAuth()
@UseGuards(JwtAuthGuard)
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
