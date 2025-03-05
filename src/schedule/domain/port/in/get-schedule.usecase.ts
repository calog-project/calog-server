import { SchedulePrimitives } from '../../model/schedule';
import { ScheduleReadModel } from '../../model/schedule-read-model';
import {
  GetScheduleDetailQuery,
  GetManyScheduleQuery,
} from '../../../application/query/schedule.query';

export const GetScheduleUseCaseSymbol = Symbol('GetScheduleUseCase');

export interface GetScheduleUseCase {
  getScheduleById(query: GetScheduleDetailQuery): Promise<ScheduleReadModel>;
  getScheduleByIds(query: GetManyScheduleQuery): Promise<ScheduleReadModel[]>;
  // getScheduleForMonth(): Promise<ScheduleSummary[]>;
}
