import { Schedule } from '../../model/schedule';

export const HandleSchedulePortSymbol = Symbol('HandleSchedulePort');
export interface HandleSchedulePort {
  save(
    schedule: Omit<Schedule, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<number>;
  update(id: number, options: Partial<Schedule>): Promise<number>;
  delete(id: number): Promise<number>;
}
