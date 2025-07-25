import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { PagedNotifications } from '../../domain/model/notification-read-model';

import { GetNotificationsByUserIdQuery } from './notification.query';
import {
  GetNotificationUseCase,
  GetNotificationUseCaseSymbol,
} from '../../domain/port/in/get-notification.usecase';

@QueryHandler(GetNotificationsByUserIdQuery)
export class GetNotificationsByUserIdHandler
  implements IQueryHandler<GetNotificationsByUserIdQuery>
{
  constructor(
    @Inject(GetNotificationUseCaseSymbol)
    private readonly _getNotiUseCase: GetNotificationUseCase,
  ) {}
  async execute(
    query: GetNotificationsByUserIdQuery,
  ): Promise<PagedNotifications> {
    return await this._getNotiUseCase.getNotiByUserId(query);
  }
}
