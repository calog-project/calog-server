import {
  Get,
  Post,
  Put,
  Patch,
  Body,
  Param,
  Query,
  Controller,
  Inject,
  HttpCode,
  HttpStatus,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Nullable } from 'src/common/type/CommonType';
import { UserMapper } from '../mapper/user.mapper';
import { JwtAccessAuthGuard } from '../../../../../common/guard/jwt-access-auth.guard';

// import {  } from '../../../../domain/model/user-read-model';

import {
  ApproveFollowCommand,
  PostFollowCommand,
  RejectFollowCommand,
  UnfollowCommand,
  CancelFollowRequestCommand,
} from '../../../../application/command/user.command';
import {
  GetUserByIdQuery,
  GetFollowerQuery,
  GetFollowingQuery,
  SearchUsersQuery,
} from '../../../../application/query/user.query';
import { PaginationRequestDto } from '../../../../../common/dto/pagination-request.dto';
import {
  CreateUserDto,
  SearchUsersReqDto,
  UpdateUserDto,
} from '../dto/user.req';
import {
  ShowUserResDto,
  SearchUsersByOffsetResDto,
  SearchUsersByCursorResDto,
  ShowFollowUsersResDto,
} from '../dto/user.res';

import {
  CreateUserUseCaseSymbol,
  CreateUserUseCase,
} from 'src/user/domain/port/in/create-user.usecase';
import {
  GetUserUseCaseSymbol,
  GetUserUseCase,
} from 'src/user/domain/port/in/get-user.usecase';
import {
  UpdateUserUseCase,
  UpdateUserUseCaseSymbol,
} from 'src/user/domain/port/in/update-user.usecase';
import { UserId } from '../../../../../common/decorator/user-id.decorator';

@Controller('user')
export class UserController {
  constructor(
    @Inject(CreateUserUseCaseSymbol)
    private readonly _createUserUseCase: CreateUserUseCase,
    @Inject(GetUserUseCaseSymbol)
    private readonly _getUserUseCase: GetUserUseCase,
    @Inject(UpdateUserUseCaseSymbol)
    private readonly _updateUserUseCase: UpdateUserUseCase,
    private readonly _commandBus: CommandBus,
    private readonly _queryBus: QueryBus,
  ) {}

  // ------ 검색/검증 그룹 ------
  @Get('search')
  async searchUsers(
    @Query() params: SearchUsersReqDto,
  ): Promise<SearchUsersByOffsetResDto | SearchUsersByCursorResDto> {
    const result = await this._queryBus.execute(
      new SearchUsersQuery(
        params.mode,
        params.keyword,
        params.limit,
        params.offset,
        params.cursor,
      ),
    );
    return params.mode === 'offset'
      ? new SearchUsersByOffsetResDto(result)
      : new SearchUsersByCursorResDto(result);
  }

  @Get('check-email/:email')
  async checkEmail(
    @Param('email') email: string,
  ): Promise<{ isAvailable: boolean }> {
    const isExists = await this._getUserUseCase.isExistsEmail(email);
    const isAvailable = !isExists;
    return { isAvailable };
  }

  @Get('check-nickname/:nickname')
  async checkNickname(
    @Param('nickname') nickname: string,
  ): Promise<{ isAvailable: boolean }> {
    const isExists = await this._getUserUseCase.isExistsNickname(nickname);
    const isAvailable = !isExists;
    return { isAvailable };
  }

  // ------ 팔로우 그룹 ------
  @Post('follow/:followerId/:followingId')
  async testFollowingUser(
    @Param('followerId') userId: number,
    @Param('followingId') followingId: number,
  ) {
    await this._commandBus.execute(new PostFollowCommand(userId, followingId));
  }

  @Post('follow/:id')
  @UseGuards(JwtAccessAuthGuard)
  async followingUser(
    @UserId() userId: number,
    @Param('id') followingId: number,
  ) {
    await this._commandBus.execute(new PostFollowCommand(userId, followingId));
  }

  @Get('follower/:viewerId/:targetId')
  async testGetFollowers(
    @Param('viewerId') viewerId: number,
    @Param('targetId') targetId: number,
    @Query() page: PaginationRequestDto<number>,
  ) {
    const followers = await this._queryBus.execute(
      new GetFollowerQuery(viewerId, targetId, false, page.limit, page.cursor),
    );

    return new ShowFollowUsersResDto(followers);
  }

  @Get('follower/:id')
  @UseGuards(JwtAccessAuthGuard)
  async getFollowers(
    @UserId('userId') userId: number,
    @Param('id') targetId: number,
    @Query() page: PaginationRequestDto<number>,
  ) {
    const followers = await this._queryBus.execute(
      new GetFollowerQuery(userId, targetId, false, page.limit, page.cursor),
    );

    return new ShowFollowUsersResDto(followers);
  }

  @Get('following/:viewerId/:targetId')
  async testGetFollowings(
    @Param('viewerId') viewerId: number,
    @Param('targetId') targetId: number,
    @Query() page: PaginationRequestDto<number>,
  ) {
    const followings = await this._queryBus.execute(
      new GetFollowingQuery(viewerId, targetId, false, page.limit, page.cursor),
    );

    return new ShowFollowUsersResDto(followings);
  }

  @Get('following/:id')
  @UseGuards(JwtAccessAuthGuard)
  async getFollowings(
    @UserId('userId') userId: number,
    @Param('id') targetId: number,
    @Query() page: PaginationRequestDto<number>,
  ) {
    const followings = await this._queryBus.execute(
      new GetFollowingQuery(userId, targetId, false, page.limit, page.cursor),
    );

    return new ShowFollowUsersResDto(followings);
  }

  @Patch('follow/:id/:followerId/approve')
  async testApproveFollow(
    @Param('id') userId: number,
    @Param('followerId') followerId: number,
  ) {
    await this._commandBus.execute(
      new ApproveFollowCommand(followerId, userId),
    );
  }

  @Patch('follow/:id/approve')
  @UseGuards(JwtAccessAuthGuard)
  async approveFollow(
    @UserId() userId: number,
    @Param('id') followerId: number,
  ) {
    await this._commandBus.execute(
      new ApproveFollowCommand(followerId, userId),
    );
  }

  @Delete('follow/:id/:followerId/reject')
  async testRejectFollow(
    @Param('id') userId: number,
    @Param('followerId') followerId: number,
  ) {
    await this._commandBus.execute(new RejectFollowCommand(followerId, userId));
  }

  @Delete('follow/:id/reject')
  @UseGuards(JwtAccessAuthGuard)
  async rejectFollow(
    @UserId() userId: number,
    @Param('id') followerId: number,
  ) {
    await this._commandBus.execute(new RejectFollowCommand(followerId, userId));
  }

  @Delete('follow/:followerId/:followingId')
  async testUnfollow(
    @Param('followerId') followerId: number,
    @Param('followingId') followingId: number,
  ) {
    await this._commandBus.execute(
      new UnfollowCommand(followerId, followingId),
    );
  }

  @Delete('follow/:id')
  @UseGuards(JwtAccessAuthGuard)
  async unfollow(@UserId() userId: number, @Param('id') targetId: number) {
    await this._commandBus.execute(new UnfollowCommand(userId, targetId));
  }

  @Delete('follow-request/:followerId/:followingId')
  async testCancelFollowRequest(
    @Param('followerId') followerId: number,
    @Param('followingId') followingId: number,
  ) {
    await this._commandBus.execute(
      new CancelFollowRequestCommand(followerId, followingId),
    );
  }

  @Delete('follow-request/:id')
  @UseGuards(JwtAccessAuthGuard)
  async cancelFollowRequest(
    @UserId() userId: number,
    @Param('id') targetId: number,
  ) {
    await this._commandBus.execute(
      new CancelFollowRequestCommand(userId, targetId),
    );
  }

  //------CRUD 기본 그룹------
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(@Body() dto: CreateUserDto): Promise<void> {
    await this._createUserUseCase.createUser(UserMapper.toDomain(dto));
    return;
  }

  @Get(':id/:viewerId')
  async testGetUserById(
    @Param('id') id: number,
    @Param('viewerId') viewerId: number,
  ): Promise<Nullable<ShowUserResDto>> {
    const user = await this._queryBus.execute(
      new GetUserByIdQuery(id, viewerId),
    );
    return UserMapper.toDto(user);
  }

  @Get(':id')
  @UseGuards(JwtAccessAuthGuard)
  async getUserById(
    @Param('id') id: number,
    @UserId('userId') userId: number,
  ): Promise<Nullable<ShowUserResDto>> {
    const user = await this._queryBus.execute(new GetUserByIdQuery(id, userId));
    return UserMapper.toDto(user);
  }

  @Patch(':id')
  async updateUserById(
    @Param('id') id: number,
    @Body() dto: UpdateUserDto,
  ): Promise<void> {
    await this._updateUserUseCase.updateUseCommand(
      UserMapper.toDomain({ ...dto, id }),
    );
    return;
  }
}
