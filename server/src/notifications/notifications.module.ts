import { Module } from '@nestjs/common';
import { NotificationsGateway } from './notifications.gateway';
import { JwtModule } from '@nestjs/jwt';
import { NotificationsService } from './notifications.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notifications } from './notifications.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Notifications]), JwtModule],
  providers: [NotificationsGateway, NotificationsService],
})
export class NotificationsModule {}
