import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import {
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { NotificationsService } from './notifications.service';
import { NotificationToSave } from 'src/types';

@WebSocketGateway()
export class NotificationsGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;
  private notificationsMap: Map<number, NotificationToSave[]> = new Map();

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private notificationsService: NotificationsService,
  ) {}

  addNotification(userId: number, notification: NotificationToSave) {
    if (!this.notificationsMap.has(userId)) {
      this.notificationsMap.set(userId, [notification]);
    }
    this.notificationsMap.get(userId)?.push(notification);
  }

  sendAllNotifications() {
    this.notificationsMap.forEach((notifications, userId) => {
      const userSocket = Array.from(this.server.sockets.sockets.values()).find(
        (socket) => socket.userId === userId,
      );

      if (userSocket) {
        userSocket.emit('notifications', { notifications });
      }
    });

    this.notificationsMap.clear();
  }

  async handleConnection(socket: Socket) {
    console.log(`Client connected: ${socket.id}`);
    const token =
      socket.handshake.auth?.token || socket.handshake.headers?.token;

    if (!token) {
      socket.disconnect();
      return;
    }

    try {
      const decoded = await this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });

      socket.token = token;
      socket.userId = decoded.userId;

      const payload = await this.notificationsService.findAllUserNotifications(
        socket.userId,
      );
      socket.emit('userNotifications', payload);
    } catch (error: any) {
      console.error('Token verification failed:', error);
      socket.disconnect();
    }
  }

  @SubscribeMessage('checkNotifications')
  async handleCheckNotifications(socket: Socket) {
    try {
      const decoded = await this.jwtService.verify(socket.token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });

      const userId = decoded.userId;

      await this.notificationsService.markAllUserNotificationsAsRead(userId);

      socket.emit('notificationsRead', {
        message: 'All notifications marked as read',
      });
    } catch (error: any) {
      console.error('Token verification failed:', error);
      socket.disconnect();
    }
  }
}
