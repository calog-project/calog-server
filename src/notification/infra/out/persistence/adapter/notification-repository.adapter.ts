import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Notification } from '../../../../domain/model/notification';
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

  async findByUserId() {}
}
