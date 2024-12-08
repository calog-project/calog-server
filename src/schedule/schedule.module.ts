import { Module } from '@nestjs/common';
import { SchedulePersistenceModule } from './infra/out/persistence/schedule-persistence.module';

import { ScheduleController } from './infra/in/http/adapter/schedule.controller';
import { ScheduleService } from './application/service/schedule.service';
import { ScheduleRepositoryAdapter } from './infra/out/persistence/adapter/schedule-repository.adapter';
import { CategoryRepositoryAdapter } from './infra/out/persistence/adapter/category-repository.adapter';

import { CreateScheduleUseCaseSymbol } from './domain/port/in/create-schedule.usecase';
import { GetScheduleUseCaseSymbol } from './domain/port/in/get-schedule.usecase';

import { HandleSchedulePortSymbol } from './domain/port/out/handle-schedule.port';
import { LoadSchedulePortSymbol } from './domain/port/out/load-schedule.port';
import { HandleCategoryPortSymbol } from './domain/port/out/handle-category.port';
import { LoadCategoryPortSymbol } from './domain/port/out/load-category.port';

import { CreateScheduleHandler } from './application/command/schedule.command-handler';
import { ScheduleCreatedHandler } from './application/event-handler/schedule.event-handler';
import { GetScheduleDetailHandler } from './application/query/schedule.query-handler';

import { UserModule } from 'src/user/user.module';

const handlerProvider = [
  CreateScheduleHandler,
  ScheduleCreatedHandler,
  GetScheduleDetailHandler,
];

const repositoryProvider = [
  {
    provide: HandleSchedulePortSymbol,
    useExisting: ScheduleRepositoryAdapter,
  },
  {
    provide: LoadSchedulePortSymbol,
    useExisting: ScheduleRepositoryAdapter,
  },
  {
    provide: HandleCategoryPortSymbol,
    useExisting: CategoryRepositoryAdapter,
  },
  {
    provide: LoadCategoryPortSymbol,
    useExisting: CategoryRepositoryAdapter,
  },
];

const useCaseProvider = [
  {
    provide: CreateScheduleUseCaseSymbol,
    useClass: ScheduleService,
  },
  {
    provide: GetScheduleUseCaseSymbol,
    useClass: ScheduleService,
  },
];

@Module({
  imports: [SchedulePersistenceModule, UserModule],
  controllers: [ScheduleController],
  providers: [...repositoryProvider, ...useCaseProvider, ...handlerProvider],
  exports: [
    CreateScheduleUseCaseSymbol,
    GetScheduleUseCaseSymbol,
    HandleSchedulePortSymbol,
    LoadSchedulePortSymbol,
  ],
})
export class ScheduleModule {}
