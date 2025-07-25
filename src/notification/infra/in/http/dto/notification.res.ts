import { CursorPaginatedResponse } from '../../../../../common/dto/pagination-response.dto';
import {
  NotificationReadModel,
  PagedNotifications,
} from '../../../../domain/model/notification-read-model';

export class FetchNotificationsResDto extends CursorPaginatedResponse<
  NotificationReadModel,
  number
> {
  notifications: NotificationReadModel[];
  constructor(input: PagedNotifications) {
    super();
    this.notifications = input.items;
    this.limit = input.limit;
    this.cursor = input.marker;
    this.hasNext = input.hasNext;
  }
}
