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

import { SearchedUser } from '../../../../domain/model/user-read-model';

import {
  ApproveFollowCommand,
  PostFollowCommand,
  RejectFollowCommand,
  UnfollowCommand,
} from '../../../../application/command/user.command';
import { GetFollowerQuery, GetFollowingQuery, SearchUsersQuery } from '../../../../application/query/user.query';
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

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(@Body() dto: CreateUserDto): Promise<void> {
    await this._createUserUseCase.createUser(UserMapper.toDomain(dto));
    return;
  }

  @Get('search')
  async searchUser(@Query('keyword') keyword: string): Promise<SearchedUser[]> {
    return await this._queryBus.execute(new SearchUsersQuery(keyword));
  }

  @Get(':id')
  async getUserById(
    @Param('id') id: number,
  ): Promise<Nullable<ShowUserResDto>> {
    const user = await this._getUserUseCase.getUserById(id);
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

  @Post('follow/:id')
  @UseGuards(JwtAccessAuthGuard)
  async followingUser(
    @UserId() userId: number,
    @Param('id') followingId: number,
  ) {
    await this._commandBus.execute(new PostFollowCommand(userId, followingId));
  }

  @Post('follow/:followerId/:followingId')
  async testFollowingUser(
    @Param('followerId') userId: number,
    @Param('followingId') followingId: number,
  ) {
    await this._commandBus.execute(new PostFollowCommand(userId, followingId));
  }

  @Get('follower')
  @UseGuards(JwtAccessAuthGuard)
  async getFollowers(@UserId() userId: number,) {
    return await this._queryBus.execute(new GetFollowerQuery(userId, false))
  }

  @Get('follower/:id')
  async testGetFollowers(@Param('id') userId: number) {
    return await this._queryBus.execute(new GetFollowerQuery(userId, false))
  }

  @Get('following')
  @UseGuards(JwtAccessAuthGuard)
  async getFollowings(@UserId() userId: number){
    return await this._queryBus.execute(new GetFollowingQuery(userId, false))
  }

  @Get('following/:id')
  async testGetFollowings(@Param('id') userId: number) {
    return await this._queryBus.execute(new GetFollowingQuery(userId, false))
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

  @Patch('follow/:id/:followerId/approve')
  async testApproveFollow(
    @Param('id') userId: number,
    @Param('followerId') followerId: number,
  ) {
    await this._commandBus.execute(
      new ApproveFollowCommand(followerId, userId),
    );
  }

  @Delete('follow/:id/reject')
  @UseGuards(JwtAccessAuthGuard)
  async rejectFollow(
    @UserId() userId: number,
    @Param('id') followerId: number,
  ) {
    await this._commandBus.execute(new RejectFollowCommand(followerId, userId));
  }

  @Delete('follow/:id/:followerId/reject')
  async testRejectFollow(
    @Param('id') userId: number,
    @Param('followerId') followerId: number,
  ) {
    await this._commandBus.execute(new RejectFollowCommand(followerId, userId));
  }

  @Delete('follow/:id')
  @UseGuards(JwtAccessAuthGuard)
  async unfollow(@UserId() userId: number, @Param('id') targetId: number) {
    await this._commandBus.execute(new UnfollowCommand(userId, targetId));
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
}
