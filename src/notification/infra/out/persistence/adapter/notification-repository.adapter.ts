import { InjectRepository } from '@nestjs/typeorm';
import { NotificationEntity } from '../entity/notification.entity';
import { Repository } from 'typeorm';
import { HandleNotificationPort } from '../../../../domain/port/out/handle-notification.port';
import { LoadNotificationPort } from '../../../../domain/port/out/load-notification.port';

export class NotificationRepositoryAdapter
  implements HandleNotificationPort, LoadNotificationPort
{
  constructor(
    @InjectRepository(NotificationEntity)
    private readonly _notiRepository: Repository<NotificationEntity>,
  ) {}

  async save() {}

  async findById() {}

  async findByUserId() {}
}
