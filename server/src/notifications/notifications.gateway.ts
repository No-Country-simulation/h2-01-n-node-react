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

@WebSocketGateway()
export class NotificationsGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private notificationsService: NotificationsService,
  ) {}

  async handleConnection(socket: Socket) {
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

      const payload = await this.notificationsService.findAllUserNotifications(
        decoded.userId,
      );
      console.log(`Client connected: ${socket.id}`);
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
