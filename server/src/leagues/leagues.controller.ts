import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { LeaguesService } from './leagues.service';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { CountryNameDTO } from 'src/dtos/country-name.dto';
import { LeagueTypeDTO } from './dtos/type.dto';

@ApiTags('Leagues')
@ApiCookieAuth()
@UseGuards(JwtAuthGuard)
@Controller('leagues')
export class LeaguesController {
  constructor(private leaguesService: LeaguesService) {}

  @Get()
  findAll() {
    return this.leaguesService.findAll();
  }

  @Get(':id')
  findOneById(@Param('id') id: string) {
    return this.leaguesService.findOneById(+id);
  }

  @Get('country/:name')
  findManyByCountryName(@Param('name') name: string) {
    const dto = new CountryNameDTO(name);
    return this.leaguesService.findManyByCountryName(dto.name);
  }

  @Get('type/:type')
  findManyByType(@Param('type') type: string) {
    const dto = new LeagueTypeDTO(type);
    return this.leaguesService.findManyByType(dto.type);
  }
}
