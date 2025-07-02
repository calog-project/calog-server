import { NotificationType } from '../../domain/model/notification-type';

export interface NotificationPayload {
  type: NotificationType;
  receiverId: number;
  message: string;
  meta?: Record<string, any>;
  url?: string;
  actionable: boolean;
}
