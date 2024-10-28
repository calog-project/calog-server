import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCommand } from './user.command';
import {
  HandleUserPortSymbol,
  HandleUserPort,
} from '../../domain/port/out/handle-user.port';
import {
  CreateUserUseCaseSymbol,
  CreateUserUseCase,
} from '../../domain/port/in/create-user.usecase';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    @Inject(CreateUserUseCaseSymbol)
    private readonly _createUserUseCase: CreateUserUseCase,
  ) {}
  async execute(command: CreateUserCommand) {
    // await this._createUserUseCase.createUser()
    return;
  }
}
