import { Module } from '@nestjs/common';
import { NotificationController } from './infra/in/message/adapter/notification.controller';
import { ScheduleCreatedNotificationHandler } from './application/command/notification.command-handler';

@Module({
  imports: [],
  controllers: [NotificationController],
  providers: [ScheduleCreatedNotificationHandler],
})
export class NotificationModule {}
