import { Module } from '@nestjs/common';
import { NotificationPersistenceModule } from './infra/out/persistence/notification-persistence.module';

import { NotificationController } from './infra/in/message/adapter/notification.controller';
import { NotificationGateway } from './infra/in/socket/websocket.gateway';
import { NotificationService } from './application/service/notification.service';
import { NotificationRepositoryAdapter } from './infra/out/persistence/adapter/notification-repository.adapter';
import { WebsocketNotificationAdapter } from './infra/out/sender/adapter/websocket-notification.adapter';

import { CreateNotificationUseCaseSymbol } from './domain/port/in/create-notification.usecase';
import { GetNotificationUseCaseSymbol } from './domain/port/in/get-notification.usecase';

import { HandleNotificationPortSymbol } from './domain/port/out/handle-notification.port';
import { LoadNotificationPortSymbol } from './domain/port/out/load-notification.port';
import { SenderPortSymbol } from './domain/port/out/sender.port';

import {
  ScheduleCreatedNotificationHandler,
  TestCommandHandler,
} from './application/command/notification.command-handler';
import { TestEventHandler } from './application/event-handler/test.event-handler';

const gatewayProvider = [NotificationGateway];

const useCaseProvider = [
  {
    provide: CreateNotificationUseCaseSymbol,
    useClass: NotificationService,
  },
  {
    provide: GetNotificationUseCaseSymbol,
    useClass: NotificationService,
  },
];

const adapterProvider = [
  {
    provide: SenderPortSymbol,
    useClass: WebsocketNotificationAdapter,
  },
  {
    provide: HandleNotificationPortSymbol,
    useExisting: NotificationRepositoryAdapter,
  },
  {
    provide: LoadNotificationPortSymbol,
    useExisting: NotificationRepositoryAdapter,
  },
];

const handlerProvider = [
  TestCommandHandler,
  ScheduleCreatedNotificationHandler,
  TestEventHandler,
];

@Module({
  imports: [NotificationPersistenceModule],
  controllers: [NotificationController],
  providers: [
    ...gatewayProvider,
    ...useCaseProvider,
    ...adapterProvider,
    ...handlerProvider,
  ],
  exports: [],
})
export class NotificationModule {}
