import { Schedule } from '../../model/schedule';
import { CreateScheduleCommand } from '../../../application/command/schedule.command';

export const CreateScheduleUseCaseSymbol = Symbol('CreateScheduleUseCase');

export interface CreateScheduleUseCase {
  createSchedule(command: CreateScheduleCommand): Promise<any>;
}
