import {
  Inject,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { Nullable } from 'src/common/type/CommonType';

import { User } from 'src/user/domain/model/user';
import {
  UserProfile,
  FollowStatus,
  PagedFollowUsers,
  PagedOffsetBaseSearchUsers,
  PagedCursorBaseSearchUsers,
} from '../../domain/model/user-read-model';

import {
  ApproveFollowCommand,
  PostFollowCommand,
  RejectFollowCommand,
  UnfollowCommand,
  UpdateUserCommand,
} from '../command/user.command';
import {
  GetUserByIdQuery,
  GetUserByEmailQuery,
  GetUsersQuery,
  GetFollowerQuery,
  GetFollowingQuery,
  SearchUsersQuery,
} from '../query/user.query';

//Input port
import { CreateUserUseCase } from '../../domain/port/in/create-user.usecase';
import { GetUserUseCase } from '../../domain/port/in/get-user.usecase';
import { UpdateUserUseCase } from 'src/user/domain/port/in/update-user.usecase';
import { FollowUseCase } from '../../domain/port/in/follow.usecase';

//Output port
import {
  HandleUserPortSymbol,
  HandleUserPort,
} from 'src/user/domain/port/out/handle-user.port';
import {
  LoadUserPortSymbol,
  LoadUserPort,
} from 'src/user/domain/port/out/load-user.port';
import {
  EncryptPortSymbol,
  EncryptPort,
} from 'src/auth/domain/port/out/encrypt.port';
import { FilePortSymbol, FilePort } from 'src/user/domain/port/out/file.port';
import { FollowRequestedEvent } from '../../domain/follow-requested.event';
import { Event } from '../../../common/domain/event';
import { FollowedEvent } from '../../domain/followed.event';

@Injectable()
export class UserService
  implements CreateUserUseCase, GetUserUseCase, UpdateUserUseCase, FollowUseCase
{
  constructor(
    @Inject(EncryptPortSymbol)
    private readonly _encryptPort: EncryptPort,
    @Inject(FilePortSymbol)
    private readonly _filePort: FilePort,
    @Inject(HandleUserPortSymbol)
    private readonly _handleUserPort: HandleUserPort,
    @Inject(LoadUserPortSymbol)
    private readonly _loadUserPort: LoadUserPort,
    private readonly _eventBus: EventBus,
  ) {}

  async createUser(
    user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<number | string> {
    const isExists = await this._loadUserPort.findByEmail(
      user.props.email.getValue(),
    );
    if (isExists) throw new BadRequestException('이미 사용중인 이메일입니다.');

    user.changePassword(
      await this._encryptPort.encryptPassword(user.props.password),
    );
    // user.initImage(await this._filePort)
    return await this._handleUserPort.save(user);
  }

  async getUserById(query: GetUserByIdQuery): Promise<Nullable<UserProfile>> {
    const viewerId = query.targetId === query.viewerId ? null : query.viewerId;
    const user = await this._loadUserPort.findById(query.targetId, viewerId);
    if (!user) throw new NotFoundException('존재하지 않은 사용자입니다.');
    return user;
  }

  async getUserByEmail(
    query: GetUserByEmailQuery,
  ): Promise<Nullable<UserProfile>> {
    const user = await this._loadUserPort.findByEmail(query.email);
    if (!user) throw new NotFoundException('존재하지 않은 사용자입니다.');
    return user;
  }

  async isExistsEmail(email: string): Promise<boolean> {
    const user = await this._loadUserPort.findByEmail(email);
    return !!user;
  }

  async isExistsNickname(nickname: string): Promise<boolean> {
    const user = await this._loadUserPort.findByNickname(nickname);
    return !!user;
  }

  async searchUsers(
    query: SearchUsersQuery,
  ): Promise<PagedOffsetBaseSearchUsers | PagedCursorBaseSearchUsers> {
    if (query.mode === 'offset') {
      if (query.keyword.length === 0) {
        return {
          items: [],
          limit: query.limit,
          marker: 0,
        };
      }
      return await this._loadUserPort.searchUsersByEmailOrNicknameUseOffset(
        query.keyword,
        query.limit > 10 ? query.limit : 10,
        query.offset ?? 0,
      );
    } else {
      if (query.keyword.length === 0) {
        return {
          items: [],
          limit: query.limit,
          marker: '',
        };
      }
      return await this._loadUserPort.searchUsersByEmailOrNicknameUseCursor(
        query.keyword,
        query.limit > 10 ? query.limit : 10,
        query.cursor ?? '',
      );
    }
  }

  async getFollowers(query: GetFollowerQuery): Promise<PagedFollowUsers> {
    if (!query.viewerId || !query.targetId) {
      throw new BadRequestException('잘못된 인자입니다');
    }

    const followers = await this._loadUserPort.findFollowers(
      query.viewerId,
      query.targetId,
      query.onlyApproved,
      query.limit,
      query.cursor ?? null,
    );
    return followers;
  }

  async getFollowings(query: GetFollowingQuery): Promise<PagedFollowUsers> {
    if (!query.viewerId || !query.targetId) {
      throw new BadRequestException('잘못된 인자입니다');
    }

    const followings = await this._loadUserPort.findFollowing(
      query.viewerId,
      query.targetId,
      query.onlyApproved,
      query.limit,
      query.cursor ?? null,
    );
    return followings;
  }

  async update(id: number, options: Partial<User>): Promise<number | string> {
    const user = await this._loadUserPort.findById(id);
    if (!user) throw new NotFoundException('존재하지 않은 사용자입니다.');
    console.log(options);
    const result = await this._handleUserPort.update(options);
    return;
  }

  async updateUseCommand(command: UpdateUserCommand): Promise<number | string> {
    const user = await this._loadUserPort.loadUserAggregateById(command.id);
    if (!user) throw new NotFoundException('존재하지 않은 사용자입니다.');
    const isExistsNickname = await this._loadUserPort.findByNickname(
      command.nickname,
    );
    if (isExistsNickname) {
      throw new BadRequestException('이미 사용중인 닉네임입니다.');
    }
    user.updateNickName(command.nickname);
    user.changeImage(command.image);
    user.updateDescription(command.description);
    return await this._handleUserPort.update(user);
  }

  async postFollow(command: PostFollowCommand): Promise<number> {
    if (command.followerId === command.followingId) {
      throw new BadRequestException('팔로워 Id와 팔로잉 Id가 같습니다.');
    }
    const follower = await this._loadUserPort.loadUserAggregateById(
      command.followerId,
    );
    const targetUser = await this._loadUserPort.loadUserAggregateById(
      command.followingId,
    );
    // const isPublic = targetUser?.isPublic ?? false;
    const isPublic = false;
    let followerId: number;
    let event: Event;

    //TODO 공개 계정, 비공개 계정 분기
    if (isPublic) {
      followerId = await this._handleUserPort.saveFollow(
        command.followerId,
        command.followingId,
        true,
      );
      event = new FollowedEvent(
        command.followingId,
        command.followerId,
        follower.props.nickname.getValue(),
      );
    } else {
      followerId = await this._handleUserPort.saveFollow(
        command.followerId,
        command.followingId,
      );
      event = new FollowRequestedEvent(
        command.followingId,
        command.followerId,
        follower.props.nickname.getValue(),
      );
    }
    this._eventBus.publish(event);
    return followerId;
  }

  async unfollow(command: UnfollowCommand) {
    const follow = await this._loadUserPort.findFollowRelation(
      command.followerId,
      command.followingId,
    );
    if (!follow) {
      throw new BadRequestException('팔로워가 존재하지 않습니다.');
    }

    if (follow.status !== FollowStatus.APPROVED) {
      throw new BadRequestException('승인되지 않은 팔로워입니다.');
    }

    return await this._handleUserPort.deleteFollow(
      command.followerId,
      command.followingId,
    );
  }
  async approveFollow(command: ApproveFollowCommand) {
    const isExistFollow = await this._loadUserPort.findFollowRelation(
      command.followerId,
      command.followingId,
    );

    if (!isExistFollow) {
      throw new BadRequestException('팔로우 요청이 존재하지 않습니다');
    }

    const followerId = await this._handleUserPort.saveFollow(
      command.followerId,
      command.followingId,
      true,
    );

    const follower = await this._loadUserPort.loadUserAggregateById(
      command.followerId,
    );

    const event = new FollowedEvent(
      command.followingId,
      command.followerId,
      follower.props.nickname.getValue(),
    );
    this._eventBus.publish(event);

    return followerId;
  }

  async rejectFollow(command: RejectFollowCommand) {
    const follow = await this._loadUserPort.findFollowRelation(
      command.followerId,
      command.followingId,
    );
    if (!follow) {
      throw new BadRequestException('팔로우 요청이 존재하지 않습니다.');
    }

    if (follow.status === FollowStatus.APPROVED) {
      throw new BadRequestException('이미 승인된 팔로워입니다.');
    }

    return await this._handleUserPort.deleteFollow(
      command.followerId,
      command.followingId,
    );
  }
}
