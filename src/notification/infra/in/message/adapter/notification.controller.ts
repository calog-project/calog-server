import { Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { CommandBus, QueryBus, EventBus } from '@nestjs/cqrs';
import { PaginationRequestDto } from '../../../../../common/dto/pagination-request.dto';

import {
  ScheduleCreatedNotificationCommand,
  FollowedNotificationCommand,
  FollowRequestedNotificationCommand,
} from '../../../../application/command/notification.command';

import { TestCommand } from '../../../../application/command/notification.command-handler';
import { TestEvent } from '../../../../application/event-handler/test.event-handler';
import { GetNotificationsByUserIdQuery } from '../../../../application/query/notification.query';
import { FetchNotificationsResDto } from '../../http/dto/notification.res';

@Controller('notification')
export class NotificationController {
  constructor(
    private readonly _commandBus: CommandBus,
    private readonly _queryBus: QueryBus,
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
    const command = new FollowRequestedNotificationCommand(
      data.receiverId,
      data.followerId,
      data.followerNickname,
    );
    await this._commandBus.execute(command);
  }

  @Get('test')
  async testFunction() {
    const event = new TestEvent('1', 2, [1, 3, 4, 5], 'testHandler');
    await this._eventBus.publish(event);
  }

  @Get(':userId')
  async fetchNotifications(
    @Param('userId') userId: number,
    @Query() page: PaginationRequestDto<number>,
  ): Promise<FetchNotificationsResDto> {
    const query = new GetNotificationsByUserIdQuery(
      userId,
      page.limit,
      page.cursor,
    );
    const notifications = await this._queryBus.execute(query);
    return new FetchNotificationsResDto(notifications);
  }

  @Patch(':userId/read')
  async markAsRead() {}
}
