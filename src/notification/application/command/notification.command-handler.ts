import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  SendNotificationCommand,
  ScheduleCreatedNotificationCommand,
} from './notification.command';

@CommandHandler(SendNotificationCommand)
export class SendNotificationHandler
  implements ICommandHandler<SendNotificationCommand>
{
  constructor() {}
  execute(command: SendNotificationCommand): Promise<any> {
    return;
  }
}

@CommandHandler(ScheduleCreatedNotificationCommand)
export class ScheduleCreatedNotificationHandler
  implements ICommandHandler<ScheduleCreatedNotificationCommand>
{
  constructor() {}
  execute(command: ScheduleCreatedNotificationCommand): Promise<any> {
    return;
  }
}
