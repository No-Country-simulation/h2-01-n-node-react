import { Socket } from 'socket.io';

declare module 'socket.io' {
  interface Socket {
    token?: string;
    userId?: number;
  }
}
