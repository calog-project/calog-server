import {
  WebSocketGateway,
  WebSocketServer,
  ConnectedSocket,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ namespace: 'notification', cors: true })
export class NotificationGateway {
  @WebSocketServer()
  server: Server;

  sendToUser(userId: string, payload: any) {
    this.server.to(`user-${userId}`).emit('notification', payload);
  }

  @SubscribeMessage('subscribe')
  handleSub(@MessageBody() userId: string, @ConnectedSocket() client: Socket) {
    client.join(`user-${userId}`);
  }
}
