import { Injectable } from '@nestjs/common';
import { SenderPort } from '../../../../domain/port/out/sender.port';
import { NotificationGateway } from '../../../../../common/gateway/websocket.gateway';
import { Notification } from '../../../../domain/model/notification';
import { ClientNotificationPayload } from '../../../../application/dto/notification-payload';

@Injectable()
export class WebsocketNotificationAdapter implements SenderPort {
  constructor(private readonly gateway: NotificationGateway) {}

  async sendNotiToUser(receiverId: number, noti: Notification): Promise<void> {
    const notiPayload: ClientNotificationPayload = {
      ...noti.toPrimitives(),
      id: noti.dbId,
      createdAt: noti.props.createdAt,
      updatedAt: noti.props.updatedAt,
    };
    this.gateway.sendNoti<ClientNotificationPayload>(receiverId, notiPayload);
  }
}
