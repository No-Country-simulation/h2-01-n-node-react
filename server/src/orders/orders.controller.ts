import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { MercadopagoService } from 'src/mercadopago/mercadopago.service';
import { OrdersService } from './orders.service';

@ApiTags('Orders')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Controller('orders')
export class OrdersController {
  constructor(
    private ordersService: OrdersService,
    private mercadogpagoService: MercadopagoService,
  ) {}

  @Post()
  async generatePaymentLink(@Req() req) {
    const init_point = await this.mercadogpagoService.generatePaymentLink(
      req.user.userId,
    );

    return { initPoint: init_point };
  }

  @Get('/user')
  async findAllByUserId(@Req() req) {
    return await this.ordersService.findAllByUserId(req.user.userId);
  }
}
