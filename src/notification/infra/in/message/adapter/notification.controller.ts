import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { CommandBus } from '@nestjs/cqrs';
import { ScheduleCreatedNotificationCommand } from '../../../../application/command/notification.command';

@Controller()
export class NotificationController {
  constructor(private readonly _commandBus: CommandBus) {}

  @EventPattern('schedule.created')
  async handleScheduleCreatedEvent(data) {
    //흐름 일정 생성됨 -> 일정 생성 알림 생성됨 -> 사용자들에게 알림 보내기
    const command = new ScheduleCreatedNotificationCommand();
    console.log('emit event notifications');
    await this._commandBus.execute(command);
  }
}
