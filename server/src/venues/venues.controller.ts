import { Body, Controller, Get, Param, UseGuards } from '@nestjs/common';
import { VenuesService } from './venues.service';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { CountryNameDTO } from 'src/dtos/country-name.dto';

@ApiTags('Venues')
@ApiCookieAuth()
@UseGuards(JwtAuthGuard)
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
