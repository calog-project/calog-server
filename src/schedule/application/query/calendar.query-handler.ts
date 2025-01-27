import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import {
  GetCalendarByPeriodQuery,
  GetInitialCalendarQuery,
} from './calendar.query';
import { Calendar } from '../../domain/model/calendar';
import {
  GetCalendarUseCaseSymbol,
  GetCalendarUseCase,
} from '../../domain/port/in/get-calendar.usecase';
import { ScheduleReadModel } from '../../domain/model/schedule-read-model';

@QueryHandler(GetInitialCalendarQuery)
export class InitCalendarHandler
  implements IQueryHandler<GetInitialCalendarQuery>
{
  constructor(
    @Inject(GetCalendarUseCaseSymbol)
    private readonly _getCalendarUseCase: GetCalendarUseCase,
  ) {}
  async execute(query: GetInitialCalendarQuery): Promise<Calendar> {
    return await this._getCalendarUseCase.initCalendar(query);
  }
}

@QueryHandler(GetCalendarByPeriodQuery)
export class GetCalendarByPeriodHandler
  implements IQueryHandler<GetCalendarByPeriodQuery>
{
  constructor(
    @Inject(GetCalendarUseCaseSymbol)
    private readonly _getCalendarUseCase: GetCalendarUseCase,
  ) {}
  async execute(query: GetCalendarByPeriodQuery): Promise<ScheduleReadModel[]> {
    return await this._getCalendarUseCase.getCalendarByMonth(query);
  }
}
