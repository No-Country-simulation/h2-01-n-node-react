import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { MercadopagoService } from './mercadopago.service';
import { ApiExcludeEndpoint } from '@nestjs/swagger';

@Controller('mercadopago')
export class MercadopagoController {
  constructor(private mercadopagoService: MercadopagoService) {}

  @ApiExcludeEndpoint()
  @Post('payments')
  createOrder(@Body() body) {
    const paymentId = body?.data?.id;

    if (!paymentId)
      throw new BadRequestException('Missing payment ID in the request body');

    return this.mercadopagoService.createOrder(paymentId);
  }
}
