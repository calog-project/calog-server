import { SchedulePrimitives } from '../../model/schedule';
import { ScheduleSummary } from '../../model/schedule-summary';

export const LoadSchedulePortSymbol = Symbol('LoadSchedulePort');
export interface LoadSchedulePort {
  findById(id: number): Promise<SchedulePrimitives | null>;

  findByIds(ids: number[]): Promise<SchedulePrimitives[] | ScheduleSummary[]>;

  findByMonth(): void;
  // findByJoiner()
  // findByDate()
}
