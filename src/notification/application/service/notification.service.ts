import { Inject, Injectable } from '@nestjs/common';
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
  async create(): Promise<void> {
    return;
  }

  async getNotiById(): Promise<void> {}

  async getNotiByUserId(): Promise<void> {}
}
