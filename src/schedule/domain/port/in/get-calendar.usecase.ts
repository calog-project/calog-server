import {
  GetInitialCalendarQuery,
  GetCalendarByPeriodQuery,
} from '../../../application/query/calendar.query';
import { Calendar } from '../../model/calendar';
import { ScheduleReadModel } from '../../model/schedule-read-model';

export const GetCalendarUseCaseSymbol = Symbol('GetCalendarUseCaseSymbol');

export interface GetCalendarUseCase {
  initCalendar(query: GetInitialCalendarQuery): Promise<Calendar>;
  getCalendarByMonth(
    query: GetCalendarByPeriodQuery,
  ): Promise<ScheduleReadModel[]>;
}
