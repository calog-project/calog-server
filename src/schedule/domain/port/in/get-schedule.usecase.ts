import { SchedulePrimitives } from '../../model/schedule';
import {
  ScheduleFullReadModel,
  ScheduleReadModel,
} from '../../model/schedule-read-model';
import {
  GetScheduleDetailQuery,
  GetManyScheduleQuery,
} from '../../../application/query/schedule.query';

export const GetScheduleUseCaseSymbol = Symbol('GetScheduleUseCase');

export interface GetScheduleUseCase {
  getScheduleById(
    query: GetScheduleDetailQuery,
  ): Promise<ScheduleFullReadModel>;
  getScheduleByIds(query: GetManyScheduleQuery): Promise<ScheduleReadModel[]>;
  // getScheduleForMonth(): Promise<ScheduleSummary[]>;
}
