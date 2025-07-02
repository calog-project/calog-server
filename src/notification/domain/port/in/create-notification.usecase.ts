import { NotificationPayload } from '../../../application/dto/notification-payload';

export const CreateNotificationUseCaseSymbol = Symbol(
  'CreateNotificationUseCase',
);

export interface CreateNotificationUseCase {
  notifyToUser(input: NotificationPayload): Promise<void>;
}
