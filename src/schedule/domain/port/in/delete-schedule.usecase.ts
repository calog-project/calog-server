import { DeleteScheduleCommand } from '../../../application/command/schedule.command';

export const DeleteScheduleUseCaseSymbol = Symbol('DeleteScheduleUseCase');

export interface DeleteScheduleUseCase {
  deleteSchedule(command: DeleteScheduleCommand): Promise<number>;
}
