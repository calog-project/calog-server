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
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Nullable } from 'src/common/type/CommonType';
import { UserMapper } from '../mapper/user.mapper';
import { JwtAccessAuthGuard } from '../../../../../common/guard/jwt-access-auth.guard';

import { SearchedUser } from '../../../../domain/model/user-read-model';

import {
  ApproveFollowCommand,
  PostFollowCommand,
  RejectFollowCommand,
  UnfollowCommand,
} from '../../../../application/command/user.command';
import {
  GetUserByIdQuery,
  SearchUsersQuery,
  GetFollowerQuery,
  GetFollowingQuery,
} from '../../../../application/query/user.query';
import { CreateUserDto, UpdateUserDto } from '../dto/user.req';
import { ShowUserResDto } from '../dto/user.res';

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
  async searchUser(
    @Query('keyword') keyword: string,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
  ): Promise<SearchedUser[]> {
    return await this._queryBus.execute(
      new SearchUsersQuery(keyword, limit, offset),
    );
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

  @Get('follower/:id')
  async testGetFollowers(@Param('id') userId: number) {
    return await this._queryBus.execute(new GetFollowerQuery(userId, false));
  }

  @Get('follower')
  @UseGuards(JwtAccessAuthGuard)
  async getFollowers(@UserId('userId') userId: number) {
    return await this._queryBus.execute(new GetFollowerQuery(userId, false));
  }

  @Get('following/:id')
  async testGetFollowings(@Param('id') userId: number) {
    return await this._queryBus.execute(new GetFollowingQuery(userId, false));
  }

  @Get('following')
  @UseGuards(JwtAccessAuthGuard)
  async getFollowings(@UserId('userId') userId: number) {
    return await this._queryBus.execute(new GetFollowingQuery(userId, false));
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
