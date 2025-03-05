import { SchedulePrimitives } from '../../model/schedule';
import { ScheduleReadModel } from '../../model/schedule-read-model';

export const LoadSchedulePortSymbol = Symbol('LoadSchedulePort');
export interface LoadSchedulePort {
  findById(id: number, userId?: number): Promise<ScheduleReadModel | null>;

  findByIds(ids: number[]): Promise<ScheduleReadModel[]>;

  findByUserIdAndPeriod(
    userId: number,
    start: Date,
    end: Date,
  ): Promise<ScheduleReadModel[]>;

  findUserCategoryMappings(): Promise<Map<string, number>>;
  // findByJoiner()
  // findByDate()
}
