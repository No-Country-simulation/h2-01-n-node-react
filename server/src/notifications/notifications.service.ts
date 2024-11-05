import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Notifications } from './notifications.entity';
import { Repository } from 'typeorm';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notifications)
    private notificationsRepository: Repository<Notifications>,
  ) {}
  // async createNotification(userId: number, message: string, type?: string) {
  //   const notification = this.notificationsRepository.create({
  //     userId,
  //     message,
  //     type,
  //   });
  //   return await this.notificationsRepository.save(notification);
  // }

  async findAllUserNotifications(userId: number) {
    const notifications = await this.notificationsRepository
      .createQueryBuilder('notifications')
      .where('notifications.userId = :userId', { userId })
      .orderBy('notifications.createdAt', 'DESC')
      .getMany();

    const unreadCount = await this.notificationsRepository
      .createQueryBuilder('notifications')
      .where('notifications.userId = :userId', { userId })
      .andWhere('notifications.read = false')
      .getCount();

    return { notifications, unreadCount };
  }

  async markAllUserNotificationsAsRead(userId: number) {
    await this.notificationsRepository
      .createQueryBuilder()
      .update(Notifications)
      .set({ read: true })
      .where('userId = :userId', { userId })
      .execute();
  }
}
