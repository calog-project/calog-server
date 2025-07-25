import { Inject, Injectable } from '@nestjs/common';

import { NotificationPayload } from '../dto/notification-payload';
import { Notification } from '../../domain/model/notification';
import { PagedNotifications } from '../../domain/model/notification-read-model';

import { CreateNotificationUseCase } from '../../domain/port/in/create-notification.usecase';
import { GetNotificationUseCase } from '../../domain/port/in/get-notification.usecase';
import {
  HandleNotificationPortSymbol,
  HandleNotificationPort,
} from '../../domain/port/out/handle-notification.port';
import {
  LoadNotificationPortSymbol,
  LoadNotificationPort,
} from '../../domain/port/out/load-notification.port';
import {
  SenderPortSymbol,
  SenderPort,
} from '../../domain/port/out/sender.port';
import { GetNotificationsByUserIdQuery } from '../query/notification.query';

@Injectable()
export class NotificationService
  implements CreateNotificationUseCase, GetNotificationUseCase
{
  constructor(
    @Inject(HandleNotificationPortSymbol)
    private readonly _handleNotiPort: HandleNotificationPort,
    @Inject(LoadNotificationPortSymbol)
    private readonly _loadNotiPort: LoadNotificationPort,
    @Inject(SenderPortSymbol)
    private readonly _senderPort: SenderPort,
  ) {}
  async notifyToUser(input: NotificationPayload): Promise<void> {
    const noti = Notification.create({ ...input, isRead: false });
    await this._handleNotiPort.save(noti);
    await this._senderPort.sendNotiToUser(noti.props.receiverId, noti);
    return;
  }

  async getNotiById(): Promise<void> {}

  async getNotiByUserId(
    query: GetNotificationsByUserIdQuery,
  ): Promise<PagedNotifications> {
    return await this._loadNotiPort.findByUserId(
      query.userId,
      query.limit,
      query.cursor,
    );
  }
}
