import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetFollowerQuery, GetUserQuery, GetUsersQuery } from './user.query';
import { User, UserPrimitives } from '../../domain/model/user';
import {
  LoadUserPortSymbol,
  LoadUserPort,
} from '../../domain/port/out/load-user.port';
import {
  GetUserUseCase,
  GetUserUseCaseSymbol,
} from '../../domain/port/in/get-user.usecase';
import { Follower } from '../../domain/model/user-read-model';

@QueryHandler(GetUserQuery)
export class GetUserHandler
  implements IQueryHandler<GetUserQuery, User | null>
{
  constructor(
    @Inject(LoadUserPortSymbol) private readonly _loadUserPort: LoadUserPort,
  ) {}
  async execute(query: GetUserQuery): Promise<User | null> {
    const user = await this._loadUserPort.findById(query.id);
    return user ? user : null;
  }
}

@QueryHandler(GetUsersQuery)
export class GetUsersHandler
  implements IQueryHandler<GetUsersQuery, User[] | null>
{
  constructor(
    @Inject(LoadUserPortSymbol) private readonly _loadUserPort: LoadUserPort,
  ) {}
  async execute(query: GetUsersQuery): Promise<User[] | null> {
    const user = await this._loadUserPort.findByIds(query.ids);
    return user.length > 0 ? user : null;
  }
}

@QueryHandler(GetFollowerQuery)
export class GetFollowerHandler implements IQueryHandler<GetFollowerQuery> {
  constructor(
    @Inject(GetUserUseCaseSymbol)
    private readonly _getUserUseCase: GetUserUseCase,
  ) {}
  async execute(query: GetFollowerQuery): Promise<Follower[]> {
    return await this._getUserUseCase.getFollowers(query);
  }
}
