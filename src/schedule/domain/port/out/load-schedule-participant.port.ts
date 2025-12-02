import { ScheduleParticipantReadModel } from '../../model/schedule-read-model';

export const LoadScheduleParticipantPortSymbol = Symbol(
  'LoadScheduleParticipantPort',
);
export interface LoadScheduleParticipantPort {
  findByScheduleId(scheduleId: number): Promise<ScheduleParticipantReadModel[]>;
  findByUserIds(userId: number[]): Promise<ScheduleParticipantReadModel[]>;
}
