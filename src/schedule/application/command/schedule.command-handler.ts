import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateScheduleCommand } from './schedule.command';
import {
  CreateScheduleUseCase,
  CreateScheduleUseCaseSymbol,
} from '../../domain/port/in/create-schedule.usecase';

@CommandHandler(CreateScheduleCommand)
export class CreateScheduleHandler
  implements ICommandHandler<CreateScheduleCommand>
{
  constructor(
    @Inject(CreateScheduleUseCaseSymbol)
    private readonly _createScheduleUseCase: CreateScheduleUseCase,
  ) {}
  async execute(command: CreateScheduleCommand): Promise<number> {
    return await this._createScheduleUseCase.createSchedule(command);
  }
}
