import { Schedule } from '../../model/schedule';

export const HandleSchedulePortSymbol = Symbol('HandleSchedulePort');
export interface HandleSchedulePort {
  save(
    schedule: Omit<Schedule, 'id' | 'createdAt' | 'updatedAt'>,
    categoryId: number,
    defaultCategoryId?: number,
  ): Promise<number>;
  update(schedule: Partial<Schedule>, categoryId?: number): Promise<number>;
  delete(id: number): Promise<number>;
}
