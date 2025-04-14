import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationEntity } from './entity/notification.entity';
import { NotificationRepositoryAdapter } from './adapter/notification-repository.adapter';

@Module({
  imports: [TypeOrmModule.forFeature([NotificationEntity])],
  providers: [NotificationRepositoryAdapter],
  exports: [NotificationRepositoryAdapter],
})
export class NotificationPersistenceModule {}
