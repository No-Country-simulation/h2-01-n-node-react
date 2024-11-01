import { Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { PricesService } from './prices.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { USER_ROLE } from 'src/types';
import { UpdatePriceDTO } from './dtos/update.dto';

@ApiTags('Prices')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Controller('prices')
export class PricesController {
  constructor(private pricesService: PricesService) {}

  @Get()
  findAll() {
    return this.pricesService.findAll();
  }

  @Get(':id')
  findOneById(@Param('id') id: string) {
    return this.pricesService.findOneById(+id);
  }

  // @Get(':name')
  // findOneByName(@Param('name') name: string) {
  //   return this.pricesService.findOneByName(name);
  // }

  @Roles(USER_ROLE.ADMIN)
  @Put(':id')
  updateOne(@Param('id') id: string, @Body() updatePriceDto: UpdatePriceDTO) {
    return this.pricesService.updateOne(+id, updatePriceDto);
  }
}
