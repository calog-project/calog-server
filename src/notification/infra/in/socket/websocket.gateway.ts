import {
  WebSocketGateway,
  WebSocketServer,
  ConnectedSocket,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({ namespace: 'notification', cors: true })
export class NotificationGateway {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(NotificationGateway.name);

  handleConnection(client: Socket) {
    this.server.fetchSockets().then((s) => {
      this.logger.log(
        `connected with client: ${client.id}, connecting: ${s.length}`,
      );
    });
  }

  handleDisconnect(client: Socket) {
    this.server.fetchSockets().then((s) => {
      this.logger.log(
        `disconnected with client: ${client.id}, connecting: ${s.length}`,
      );
    });
  }

  sendNoti<T>(userId: number, payload: T) {
    this.server.to(`noti-user-${userId}`).emit('notification', payload);
  }

  @SubscribeMessage('subscribe')
  handleSub(
    @MessageBody('id') userId: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.join(`noti-user-${userId}`);
    this.logger.log(`subscribe noti-user-${userId}`);
  }

  @SubscribeMessage('notificationAction')
  handleNotificationAction(
    @MessageBody('id') userId: string,
    @ConnectedSocket() client: Socket,
  ) {
    this.logger.log('to do action notification');
  }
}
