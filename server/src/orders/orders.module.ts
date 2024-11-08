import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { MercadopagoModule } from 'src/mercadopago/mercadopago.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/users/users.entity';
import { Orders } from './orders.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Orders, Users]), MercadopagoModule],
  providers: [OrdersService],
  controllers: [OrdersController],
})
export class OrdersModule {}
