import { Controller, Get, Patch } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { CommandBus, EventBus } from '@nestjs/cqrs';
import {
  ScheduleCreatedNotificationCommand,
  FollowedNotificationCommand,
  FollowRequestedNotificationCommand,
} from '../../../../application/command/notification.command';

import { TestCommand } from '../../../../application/command/notification.command-handler';
import { TestEvent } from '../../../../application/event-handler/test.event-handler';

@Controller('notification')
export class NotificationController {
  constructor(
    private readonly _commandBus: CommandBus,
    private readonly _eventBus: EventBus,
  ) {}

  @EventPattern('common.test')
  async handleTestEvent(data) {
    console.log('(Global) Published test event');
    console.log('Published Content: ', data);
    const command = new TestCommand();
    await this._commandBus.execute(command);
  }

  @EventPattern('schedule.created')
  async handleScheduleCreatedEvent(data) {
    //일정 생성됨 -> 일정 생성 알림 생성됨 -> 사용자들에게 알림 보내기
    const command = new ScheduleCreatedNotificationCommand();
    console.log('emit event notifications');
    await this._commandBus.execute(command);
  }

  @EventPattern('user.followed')
  async handleFollowedEvent(data) {
    const command = new FollowedNotificationCommand(
      data.receiverId,
      data.followerId,
      data.followerNickname,
    );
    // await this._commandBus.execute()
  }

  @EventPattern('user.follow-requested')
  async handleUserFollowRequestedEvent(data) {
    console.log(data);
    const command = new FollowRequestedNotificationCommand(
      data.receiverId,
      data.followerId,
      data.followerNickname,
    );
    // await this._commandBus.execute()
  }

  @Get('test')
  async testFunction() {
    const event = new TestEvent('1', 2, [1, 3, 4, 5], 'testHandler');
    await this._eventBus.publish(event);
  }

  @Get(':userId')
  async getUserNotification() {
    console.log(1);
  }

  @Patch(':userId/read')
  async markAsRead() {}
}
