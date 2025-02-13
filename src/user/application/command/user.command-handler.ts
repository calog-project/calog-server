import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  ApproveFollowCommand,
  CreateUserCommand,
  PostFollowCommand,
  RejectFollowCommand,
  UnfollowCommand,
} from './user.command';
import {
  HandleUserPortSymbol,
  HandleUserPort,
} from '../../domain/port/out/handle-user.port';
import {
  CreateUserUseCaseSymbol,
  CreateUserUseCase,
} from '../../domain/port/in/create-user.usecase';
import {
  FollowUseCaseSymbol,
  FollowUseCase,
} from '../../domain/port/in/follow.usecase';

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

@CommandHandler(PostFollowCommand)
export class PostFollowHandler implements ICommandHandler<PostFollowCommand> {
  constructor(
    @Inject(FollowUseCaseSymbol)
    private readonly _followUseCase: FollowUseCase,
  ) {}
  async execute(command: PostFollowCommand) {
    return await this._followUseCase.postFollow(command);
  }
}

@CommandHandler(UnfollowCommand)
export class UnfollowHandler implements ICommandHandler<UnfollowCommand> {
  constructor() {}
  async execute(command: UnfollowCommand) {
    return;
  }
}

@CommandHandler(ApproveFollowCommand)
export class ApproveFollowHandler
  implements ICommandHandler<ApproveFollowCommand>
{
  constructor() {}
  async execute(command: ApproveFollowCommand) {
    return;
  }
}

@CommandHandler(RejectFollowCommand)
export class RejectFollowHandler
  implements ICommandHandler<RejectFollowCommand>
{
  constructor() {}
  async execute(command: RejectFollowCommand) {
    return;
  }
}
