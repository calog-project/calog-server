import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  CreateScheduleUseCaseSymbol,
  CreateScheduleUseCase,
} from '../../domain/port/in/create-schedule.usecase';
import {
  UpdateScheduleUseCaseSymbol,
  UpdateScheduleUseCase,
} from '../../domain/port/in/update-schedule.usecase';
import {
  DeleteScheduleUseCaseSymbol,
  DeleteScheduleUseCase,
} from '../../domain/port/in/delete-schedule.usecase';
import {
  CreateScheduleCommand,
  DeleteScheduleCommand,
  UpdateScheduleCommand,
} from './schedule.command';

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

@CommandHandler(UpdateScheduleCommand)
export class UpdateScheduleHandler
  implements ICommandHandler<UpdateScheduleCommand>
{
  constructor(
    @Inject(UpdateScheduleUseCaseSymbol)
    private readonly _updateScheduleUseCase: UpdateScheduleUseCase,
  ) {}
  async execute(command: UpdateScheduleCommand): Promise<number> {
    return await this._updateScheduleUseCase.updateSchedule(command);
  }
}

@CommandHandler(DeleteScheduleCommand)
export class DeleteScheduleHandler
  implements ICommandHandler<DeleteScheduleCommand>
{
  constructor(
    @Inject(DeleteScheduleUseCaseSymbol)
    private readonly _deleteScheduleUseCase: DeleteScheduleUseCase,
  ) {}
  async execute(command: DeleteScheduleCommand): Promise<number> {
    return await this._deleteScheduleUseCase.deleteSchedule(command);
  }
}
