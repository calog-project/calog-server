import { PageResult } from '../../../common/type/paging';
import { NotificationType } from './notification-type';

export class NotificationReadModel {
  aggregateId: string;
  id: number;
  type: NotificationType;
  receiverId: number;
  meta?: Record<string, any>; // 행동형 알림일 경우 추가 정보 저장 (예: scheduleId)
  message: string;
  url?: string;
  isRead: boolean;
  actionable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type PagedNotifications = PageResult<NotificationReadModel, number>;
