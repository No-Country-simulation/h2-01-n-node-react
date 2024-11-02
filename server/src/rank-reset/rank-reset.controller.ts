import { Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { RankResetService } from './rank-reset.service';
import { UpdateRankResetDTO } from './dtos/update.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { USER_ROLE } from 'src/types';

@ApiTags('Rank Reset')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Controller('rank-reset')
export class RankResetController {
  constructor(private rankResetService: RankResetService) {}
  @Get()
  findAll() {
    return this.rankResetService.findAll();
  }

  @Get(':id')
  findOneById(@Param('id') id: string) {
    return this.rankResetService.findOneById(+id);
  }

  @Roles(USER_ROLE.ADMIN)
  @Put(':id')
  updateRankResetDate(
    @Param('id') id: string,
    @Body() updateRankResetDto: UpdateRankResetDTO,
  ) {
    return this.rankResetService.updateRankResetDate(
      +id,
      updateRankResetDto.date,
    );
  }
}
