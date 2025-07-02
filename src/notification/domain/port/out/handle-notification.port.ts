import { Notification } from '../../model/notification';

export const HandleNotificationPortSymbol = Symbol('HandleNotificationPort');

export interface HandleNotificationPort {
  save(
    noti: Omit<Notification, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<void>;
}
