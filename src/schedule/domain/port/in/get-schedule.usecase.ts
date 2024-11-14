import { SchedulePrimitives } from '../../model/schedule';
import { ScheduleSummary } from '../../model/schedule-summary';
import {
  GetScheduleDetailQuery,
  GetManyScheduleQuery,
} from '../../../application/query/schedule.query';

export const GetScheduleUseCaseSymbol = Symbol('GetScheduleUseCase');

export interface GetScheduleUseCase {
  getScheduleById(query: GetScheduleDetailQuery): Promise<SchedulePrimitives>;
  getScheduleByIds(
    query: GetManyScheduleQuery,
  ): Promise<SchedulePrimitives[] | ScheduleSummary[]>;
}
