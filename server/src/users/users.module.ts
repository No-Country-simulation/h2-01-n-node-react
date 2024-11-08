import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './users.entity';
import Ranks from 'src/ranks/ranks.entities';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { Orders } from 'src/orders/orders.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Users, Ranks, Orders]), CloudinaryModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
