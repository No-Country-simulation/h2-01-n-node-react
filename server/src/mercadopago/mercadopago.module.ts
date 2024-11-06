import { Module } from '@nestjs/common';
import { MercadopagoService } from './mercadopago.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Prices } from 'src/prices/prices.entity';
import { MercadopagoController } from './mercadopago.controller';
import { Orders } from 'src/orders/orders.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Prices, Orders]), UsersModule],
  providers: [MercadopagoService],
  exports: [MercadopagoService],
  controllers: [MercadopagoController],
})
export class MercadopagoModule {}
