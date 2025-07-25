import { GetNotificationsByUserIdQuery } from '../../../application/query/notification.query';
import { PagedNotifications } from '../../model/notification-read-model';

export const GetNotificationUseCaseSymbol = Symbol('GetNotificationUseCase');

export interface GetNotificationUseCase {
  getNotiById(): Promise<void>;
  getNotiByUserId(
    query: GetNotificationsByUserIdQuery,
  ): Promise<PagedNotifications>;
}
