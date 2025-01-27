import { Module } from '@nestjs/common';
import { SchedulePersistenceModule } from './infra/out/persistence/schedule-persistence.module';

import { CalendarController } from './infra/in/http/adapter/calendar.controller';
import { ScheduleController } from './infra/in/http/adapter/schedule.controller';
import { CategoryController } from './infra/in/http/adapter/category.controller';
import { CalendarService } from './application/service/calendar.service';
import { ScheduleService } from './application/service/schedule.service';
import { CategoryService } from './application/service/category.service';
import { ScheduleRepositoryAdapter } from './infra/out/persistence/adapter/schedule-repository.adapter';
import { CategoryRepositoryAdapter } from './infra/out/persistence/adapter/category-repository.adapter';

import { GetCalendarUseCaseSymbol } from './domain/port/in/get-calendar.usecase';
import { CreateScheduleUseCaseSymbol } from './domain/port/in/create-schedule.usecase';
import { GetScheduleUseCaseSymbol } from './domain/port/in/get-schedule.usecase';
import { UpdateScheduleUseCaseSymbol } from './domain/port/in/update-schedule.usecase';
import { DeleteScheduleUseCaseSymbol } from './domain/port/in/delete-schedule.usecase';
import { CreateCategoryUseCaseSymbol } from './domain/port/in/create-category.usecase';
import { UpdateCategoryUseCaseSymbol } from './domain/port/in/update-category.usecase';
import { GetCategoryUseCaseSymbol } from './domain/port/in/get-category.usecase';
import { DeleteCategoryUseCaseSymbol } from './domain/port/in/delete-category.usecase';

import { HandleSchedulePortSymbol } from './domain/port/out/handle-schedule.port';
import { LoadSchedulePortSymbol } from './domain/port/out/load-schedule.port';
import { HandleCategoryPortSymbol } from './domain/port/out/handle-category.port';
import { LoadCategoryPortSymbol } from './domain/port/out/load-category.port';

import {
  CreateScheduleHandler,
  UpdateScheduleHandler,
  DeleteScheduleHandler,
} from './application/command/schedule.command-handler';
import {
  CreateCategoryHandler,
  UpdateCategoryHandler,
  DeleteCategoryHandler,
} from './application/command/category.command-handler';
import { ScheduleCreatedHandler } from './application/event-handler/schedule.event-handler';

import {
  InitCalendarHandler,
  GetCalendarByPeriodHandler,
} from './application/query/calendar.query-handler';
import { GetScheduleDetailHandler } from './application/query/schedule.query-handler';
import {
  GetCategoryHandler,
  GetCategoriesByUserIdHandler,
} from './application/query/category.query-handler';
import { UserModule } from 'src/user/user.module';

const handlerProvider = [
  CreateScheduleHandler,
  UpdateScheduleHandler,
  DeleteScheduleHandler,
  CreateCategoryHandler,
  UpdateCategoryHandler,
  DeleteCategoryHandler,
  ScheduleCreatedHandler,
  InitCalendarHandler,
  GetCalendarByPeriodHandler,
  GetScheduleDetailHandler,
  GetCategoryHandler,
  GetCategoriesByUserIdHandler,
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
  { provide: GetCalendarUseCaseSymbol, useClass: CalendarService },
  {
    provide: CreateScheduleUseCaseSymbol,
    useClass: ScheduleService,
  },
  {
    provide: GetScheduleUseCaseSymbol,
    useClass: ScheduleService,
  },
  {
    provide: UpdateScheduleUseCaseSymbol,
    useClass: ScheduleService,
  },
  { provide: DeleteScheduleUseCaseSymbol, useClass: ScheduleService },
  {
    provide: CreateCategoryUseCaseSymbol,
    useClass: CategoryService,
  },
  {
    provide: GetCategoryUseCaseSymbol,
    useClass: CategoryService,
  },
  {
    provide: UpdateCategoryUseCaseSymbol,
    useClass: CategoryService,
  },
  {
    provide: DeleteCategoryUseCaseSymbol,
    useClass: CategoryService,
  },
];

@Module({
  imports: [SchedulePersistenceModule, UserModule],
  controllers: [CalendarController, ScheduleController, CategoryController],
  providers: [...repositoryProvider, ...useCaseProvider, ...handlerProvider],
  exports: [
    CreateScheduleUseCaseSymbol,
    GetScheduleUseCaseSymbol,
    HandleSchedulePortSymbol,
    LoadSchedulePortSymbol,
  ],
})
export class ScheduleModule {}
