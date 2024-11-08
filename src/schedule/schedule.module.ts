import { Module } from '@nestjs/common';
import { SchedulePersistenceModule } from './infra/out/persistence/schedule-persistence.module';

import { ScheduleController } from './infra/in/http/adapter/schedule.controller';
import { ScheduleService } from './application/service/schedule.service';
import { ScheduleRepositoryAdapter } from './infra/out/persistence/adapter/schedule-repository.adatper';

import { CreateScheduleUseCaseSymbol } from './domain/port/in/create-schedule.usecase';
import { GetScheduleUseCaseSymbol } from './domain/port/in/get-schedule.usecase';
import { HandleSchedulePortSymbol } from './domain/port/out/handle-schedule.port';
import { LoadSchedulePortSymbol } from './domain/port/out/load-schedule.port';
import { CreateScheduleHandler } from './application/command/schedule.command-handler';
import { ScheduleCreatedHandler } from './application/event-handler/schedule.event-handler';
import { GetScheduleDetailHandler } from './application/query/schedule.query-handler';

import { UserModule } from 'src/user/user.module';

const handlerProvider = [
  CreateScheduleHandler,
  ScheduleCreatedHandler,
  GetScheduleDetailHandler,
];

@Module({
  imports: [SchedulePersistenceModule, UserModule],
  controllers: [ScheduleController],
  providers: [
    {
      provide: HandleSchedulePortSymbol,
      useExisting: ScheduleRepositoryAdapter,
    },
    {
      provide: LoadSchedulePortSymbol,
      useExisting: ScheduleRepositoryAdapter,
    },
    {
      provide: CreateScheduleUseCaseSymbol,
      useClass: ScheduleService,
    },
    {
      provide: GetScheduleUseCaseSymbol,
      useClass: ScheduleService,
    },
    ...handlerProvider,
  ],
  exports: [
    CreateScheduleUseCaseSymbol,
    GetScheduleUseCaseSymbol,
    HandleSchedulePortSymbol,
    LoadSchedulePortSymbol,
  ],
})
export class ScheduleModule {}
