import { ScheduleParticipant } from '../../model/schedule-participant';

export const HandleScheduleParticipantPortSymbol = Symbol(
  'HandleScheduleParticipantPort',
);
export interface HandleScheduleParticipantPort {
  bulkSave(
    participants: Omit<ScheduleParticipant, 'createdAt' | 'updatedAt'>[],
  ): Promise<number[]>;

  save(
    participant: Omit<ScheduleParticipant, 'createdAt' | 'updatedAt'>,
  ): Promise<void>;

  // update(
  //   schedule: Partial<Schedule>,
  //   userId: number,
  //   categoryId?: number,
  // ): Promise<number>;
  // delete(id: number): Promise<number>;
}
