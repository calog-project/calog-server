import { Injectable } from '@nestjs/common';
import { SenderPort } from '../../../../domain/port/out/sender.port';
import { NotificationGateway } from '../../../in/socket/websocket.gateway';

@Injectable()
export class WebsocketNotificationAdapter implements SenderPort {
  constructor(private readonly gateway: NotificationGateway) {}

  async sendNotiToUser<T>(receiverId: number, payload: T): Promise<void> {
    this.gateway.sendNoti(receiverId, payload);
  }
}
