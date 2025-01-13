import { Inject, Injectable } from '@nestjs/common';
import { Calendar } from '../../domain/model/calendar';
import { ScheduleReadModel } from '../../domain/model/schedule-read-model';
import { GetCalendarUseCase } from '../../domain/port/in/get-calendar.usecase';
import {
  LoadSchedulePortSymbol,
  LoadSchedulePort,
} from '../../domain/port/out/load-schedule.port';
import {
  LoadCategoryPortSymbol,
  LoadCategoryPort,
} from '../../domain/port/out/load-category.port';
import {
  GetCalendarByPeriodQuery,
  GetInitialCalendarQuery,
} from '../query/calendar.query';
import { DateTimeUtil } from '../../../common/util/date-time.util';

@Injectable()
export class CalendarService implements GetCalendarUseCase {
  constructor(
    @Inject(LoadSchedulePortSymbol)
    private readonly _loadSchedulePort: LoadSchedulePort,
    @Inject(LoadCategoryPortSymbol)
    private readonly _loadCategoryPort: LoadCategoryPort,
  ) {}

  async initCalendar(query: GetInitialCalendarQuery): Promise<Calendar> {
    const { start, end } = DateTimeUtil.getMonthStartAndEnd(query.date);
    const schedules: ScheduleReadModel[] =
      await this._loadSchedulePort.findByUserIdAndPeriod(
        query.userId,
        start,
        end,
      );
    const categories = await this._loadCategoryPort.findByUserId(query.userId);
    return { categories, schedules };
  }

  async getCalendarByMonth(
    query: GetCalendarByPeriodQuery,
  ): Promise<ScheduleReadModel[]> {
    const { start, end } = DateTimeUtil.getMonthStartAndEnd(query.date);
    const schedules = await this._loadSchedulePort.findByUserIdAndPeriod(
      query.userId,
      start,
      end,
    );
    return;
  }

  async getCalendarByMonth2(
    query: GetCalendarByPeriodQuery,
  ): Promise<ScheduleReadModel[]> {
    const { start, end } = DateTimeUtil.getMonthStartAndEnd(query.date);

    const schedules = await this._loadSchedulePort.findByUserIdAndPeriod(
      query.userId,
      start,
      end,
    );
    return;
  }
}
