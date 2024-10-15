import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { FixturesService } from './fixtures.service';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@ApiTags('Fixtures')
@ApiCookieAuth()
@UseGuards(JwtAuthGuard)
@Controller('fixtures')
export class FixturesController {
  constructor(private fixturesService: FixturesService) {}

  @Get()
  findAll() {
    return this.fixturesService.findAll();
  }

  @Get(':id')
  findOneById(@Param('id') id: string) {
    return this.fixturesService.findOneById(+id);
  }
}
