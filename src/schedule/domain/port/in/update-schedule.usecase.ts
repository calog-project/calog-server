import { UpdateScheduleCommand } from '../../../application/command/schedule.command';

export const UpdateScheduleUseCaseSymbol = Symbol('UpdateScheduleUseCase');

export interface UpdateScheduleUseCase {
  updateSchedule(command: UpdateScheduleCommand): Promise<number>;
}
