import { Injectable } from '@nestjs/common';
import { SendNotificationUseCase } from '../../domain/port/in/send-notification.usecase';

@Injectable()
export class NotificationService implements SendNotificationUseCase {
  constructor() {}
  send(): Promise<void> {
    return;
  }
}
