import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  CreateUserCommand,
  PostFollowCommand,
  UnfollowCommand,
  ApproveFollowCommand,
  RejectFollowCommand,
} from './user.command';
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
  constructor(
    @Inject(FollowUseCaseSymbol)
    private readonly _followUseCase: FollowUseCase,
  ) {}
  async execute(command: UnfollowCommand) {
    return await this._followUseCase.unfollow(command);
  }
}

@CommandHandler(ApproveFollowCommand)
export class ApproveFollowHandler
  implements ICommandHandler<ApproveFollowCommand>
{
  constructor(
    @Inject(FollowUseCaseSymbol)
    private readonly _followUseCase: FollowUseCase,
  ) {}
  async execute(command: ApproveFollowCommand) {
    return await this._followUseCase.approveFollow(command);
  }
}

@CommandHandler(RejectFollowCommand)
export class RejectFollowHandler
  implements ICommandHandler<RejectFollowCommand>
{
  constructor(
    @Inject(FollowUseCaseSymbol)
    private readonly _followUseCase: FollowUseCase,
  ) {}
  async execute(command: RejectFollowCommand) {
    return await this._followUseCase.rejectFollow(command);
  }
}
