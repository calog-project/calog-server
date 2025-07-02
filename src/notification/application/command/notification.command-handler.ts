import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import {
  CreateNotificationUseCase,
  CreateNotificationUseCaseSymbol,
} from '../../domain/port/in/create-notification.usecase';
import {
  SendNotificationCommand,
  ScheduleCreatedNotificationCommand,
  FollowRequestedNotificationCommand,
  FollowedNotificationCommand,
} from './notification.command';
import { NotificationType } from '../../domain/model/notification-type';

@CommandHandler(SendNotificationCommand)
export class SendNotificationHandler
  implements ICommandHandler<SendNotificationCommand>
{
  constructor() {}
  async execute(command: SendNotificationCommand): Promise<any> {
    return;
  }
}

@CommandHandler(ScheduleCreatedNotificationCommand)
export class ScheduleCreatedNotificationHandler
  implements ICommandHandler<ScheduleCreatedNotificationCommand>
{
  constructor() {}
  async execute(command: ScheduleCreatedNotificationCommand): Promise<any> {
    return;
  }
}

@CommandHandler(FollowedNotificationCommand)
export class FollowedNotificationHandler
  implements ICommandHandler<FollowedNotificationCommand>
{
  constructor(
    @Inject(CreateNotificationUseCaseSymbol)
    private readonly _createNotiUseCase: CreateNotificationUseCase,
  ) {}
  async execute(command: FollowedNotificationCommand): Promise<void> {
    await this._createNotiUseCase.notifyToUser({
      type: NotificationType.FOLLOWED,
      receiverId: command.receiverId,
      meta: { followerId: command.followerId },
      message: `${command.followerNickname}님이 회원님을 팔로우했습니다.`,
      actionable: false,
    });
  }
}

@CommandHandler(FollowRequestedNotificationCommand)
export class FollowRequestedNotificationHandler
  implements ICommandHandler<FollowRequestedNotificationCommand>
{
  constructor(
    @Inject(CreateNotificationUseCaseSymbol)
    private readonly _createNotiUseCase: CreateNotificationUseCase,
  ) {}
  async execute(command: FollowRequestedNotificationCommand): Promise<void> {
    await this._createNotiUseCase.notifyToUser({
      type: NotificationType.FOLLOW_REQUESTED,
      receiverId: command.receiverId,
      meta: { followerId: command.followerId },
      message: `${command.followerNickname}님이 회원님에게 팔로우요청을 보냈습니다.`,
      actionable: true,
    });
  }
}

export class TestCommand {
  constructor() {}
}

@CommandHandler(TestCommand)
export class TestCommandHandler implements ICommandHandler<TestCommand> {
  constructor() {}
  async execute(command: TestCommand): Promise<any> {
    console.log('test command Handling');
    return;
  }
}
