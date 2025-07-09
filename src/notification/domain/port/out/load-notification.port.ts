import { PagedNotifications } from '../../model/notification-read-model';

export const LoadNotificationPortSymbol = Symbol('LoadNotificationPort');

export interface LoadNotificationPort {
  findById(id: number): Promise<void>;

  findByUserId(
    userId: number,
    limit: number,
    cursor: number,
  ): Promise<PagedNotifications>;
}
