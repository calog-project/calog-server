import {
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
  ConnectedSocket,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { Server, Socket } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { Logger } from '@nestjs/common';

@WebSocketGateway({ cors: true })
export class NotificationGateway implements OnGatewayInit {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(NotificationGateway.name);

  constructor(@InjectRedis() private readonly redis: Redis) {}

  async afterInit() {
    const pubClient = this.redis;
    const subClient = pubClient.duplicate();

    this.server.adapter(createAdapter(pubClient, subClient));
    this.logger.log('Websocket Redis adapter initialized');
  }

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

  @SubscribeMessage('join')
  handleSub(
    @MessageBody('userId') userId: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.join(`noti-user-${userId}`);
    this.logger.log(`subscribe noti-user-${userId}`);
  }

  @SubscribeMessage('notificationAction')
  handleNotificationAction(
    @MessageBody('userId') userId: string,
    @ConnectedSocket() client: Socket,
  ) {
    this.logger.log('to do action notification');
  }
}
