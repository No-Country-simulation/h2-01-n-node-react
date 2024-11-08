import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { LeaguesService } from './leagues.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CountryNameDTO } from 'src/dtos/country-name.dto';
import { LeagueTypeDTO } from './dtos/type.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@ApiTags('Leagues')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Controller('leagues')
export class LeaguesController {
  constructor(private leaguesService: LeaguesService) {}

  @Get()
  findAll() {
    return this.leaguesService.findAll();
  }

  @Get('/current')
  findAllWithActiveSeasons() {
    return this.leaguesService.findAllWithActiveSeasons();
  }

  @Get(':id')
  @UseInterceptors(ClassSerializerInterceptor)
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
