import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import {
  GetUserByIdQuery,
  GetUserByEmailQuery,
  GetUsersQuery,
  GetFollowerQuery,
  GetFollowingQuery,
  SearchUsersQuery,
} from './user.query';

import {
  UserReadModel,
  UserProfile,
  PagedOffsetBaseSearchUsers,
  PagedCursorBaseSearchUsers,
  FollowUser,
} from '../../domain/model/user-read-model';
import {
  LoadUserPortSymbol,
  LoadUserPort,
} from '../../domain/port/out/load-user.port';
import {
  GetUserUseCase,
  GetUserUseCaseSymbol,
} from '../../domain/port/in/get-user.usecase';

@QueryHandler(GetUserByIdQuery)
export class GetUserByIdHandler
  implements IQueryHandler<GetUserByIdQuery, UserReadModel | null>
{
  constructor(
    @Inject(GetUserUseCaseSymbol)
    private readonly _getUserUseCase: GetUserUseCase,
    // @Inject(LoadUserPortSymbol) private readonly _loadUserPort: LoadUserPort,
  ) {}
  async execute(query: GetUserByIdQuery): Promise<UserProfile | null> {
    return await this._getUserUseCase.getUserById(query);
  }
}

@QueryHandler(GetUserByEmailQuery)
export class GetUserByEmailHandler
  implements IQueryHandler<GetUserByEmailQuery, UserProfile | null>
{
  constructor(
    @Inject(GetUserUseCaseSymbol)
    private readonly _getUserUseCase: GetUserUseCase,
    // @Inject(LoadUserPortSymbol) private readonly _loadUserPort: LoadUserPort,
  ) {}
  async execute(query: GetUserByEmailQuery): Promise<UserProfile | null> {
    return await this._getUserUseCase.getUserByEmail(query);
  }
}

@QueryHandler(GetUsersQuery)
export class GetUsersHandler
  implements IQueryHandler<GetUsersQuery, UserReadModel[]>
{
  constructor(
    @Inject(LoadUserPortSymbol) private readonly _loadUserPort: LoadUserPort,
  ) {}
  async execute(query: GetUsersQuery): Promise<UserProfile[]> {
    return await this._loadUserPort.findByIds(query.ids);
  }
}

@QueryHandler(SearchUsersQuery)
export class SearchUsersHandler implements IQueryHandler<SearchUsersQuery> {
  constructor(
    @Inject(GetUserUseCaseSymbol)
    private readonly _getUserUseCase: GetUserUseCase,
  ) {}
  async execute(
    query: SearchUsersQuery,
  ): Promise<PagedOffsetBaseSearchUsers | PagedCursorBaseSearchUsers> {
    return await this._getUserUseCase.searchUsers(query);
  }
}

@QueryHandler(GetFollowerQuery)
export class GetFollowerHandler implements IQueryHandler<GetFollowerQuery> {
  constructor(
    @Inject(GetUserUseCaseSymbol)
    private readonly _getUserUseCase: GetUserUseCase,
  ) {}
  async execute(query: GetFollowerQuery): Promise<FollowUser[]> {
    return await this._getUserUseCase.getFollowers(query);
  }
}

@QueryHandler(GetFollowingQuery)
export class GetFollowingHandler implements IQueryHandler<GetFollowingQuery> {
  constructor(
    @Inject(GetUserUseCaseSymbol)
    private readonly _getUserUseCase: GetUserUseCase,
  ) {}
  async execute(query: GetFollowerQuery): Promise<FollowUser[]> {
    return await this._getUserUseCase.getFollowings(query);
  }
}
