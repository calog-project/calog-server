import { InjectRepository } from '@nestjs/typeorm';
import { Equal, LessThan, Repository } from 'typeorm';

import { Notification } from '../../../../domain/model/notification';
import {
  NotificationReadModel,
  PagedNotifications,
} from '../../../../domain/model/notification-read-model';
import { NotificationEntity } from '../entity/notification.entity';

import { HandleNotificationPort } from '../../../../domain/port/out/handle-notification.port';
import { LoadNotificationPort } from '../../../../domain/port/out/load-notification.port';

export class NotificationRepositoryAdapter
  implements HandleNotificationPort, LoadNotificationPort
{
  constructor(
    @InjectRepository(NotificationEntity)
    private readonly _notiRepository: Repository<NotificationEntity>,
  ) {}

  async save(noti: Omit<Notification, 'id' | 'createdAt' | 'updatedAt'>) {
    const data = noti.toPrimitives();
    const parseId = typeof data.id === 'number' ? data.id : parseInt(data.id);
    const record = new NotificationEntity();
    Object.assign(record, data);
    if (parseId) data.id = parseId;
    await this._notiRepository.save(data);
  }

  async findById() {}

  async findByUserId(
    userId: number,
    limit: number,
    cursor: number,
  ): Promise<PagedNotifications> {
    const [notifications, total] = await this._notiRepository.findAndCount({
      take: limit + 1,
      where: {
        ...(cursor && { id: LessThan(cursor) }),
        receiverId: Equal(userId),
      },
      order: {
        id: 'DESC',
      },
    });

    const sliced = notifications
      .map((noti) => {
        const notiReadModel: NotificationReadModel = {
          ...noti,
        };
        return notiReadModel;
      })
      .slice(0, limit);
    const hasNext = notifications.length > limit;
    const marker = hasNext ? sliced[sliced.length - 1].id : null;

    return {
      items: sliced,
      limit,
      marker,
      hasNext,
    };
  }
}
