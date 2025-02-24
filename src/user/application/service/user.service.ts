import {
  Inject,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Nullable } from 'src/common/type/CommonType';

import { User } from 'src/user/domain/model/user';
import { Follower } from '../../domain/model/user-read-model';

import {
  ApproveFollowCommand,
  PostFollowCommand,
  RejectFollowCommand,
  UnfollowCommand,
  UpdateUserCommand,
} from '../command/user.command';
import { GetFollowerQuery } from '../query/user.query';

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

@Injectable()
export class UserService
  implements
    CreateUserUseCase,
    GetUserUseCase,
    UpdateUserUseCase,
    FollowUseCase
{
  constructor(
    @Inject(EncryptPortSymbol)
    private _encryptPort: EncryptPort,
    @Inject(FilePortSymbol)
    private _filePort: FilePort,
    @Inject(HandleUserPortSymbol)
    private _handleUserPort: HandleUserPort,
    @Inject(LoadUserPortSymbol)
    private _loadUserPort: LoadUserPort,
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
    const result = await this._handleUserPort.save(user);
    return result;
  }

  async getUserById(id: number): Promise<Nullable<User>> {
    const user = await this._loadUserPort.findById(id);
    if (!user) throw new NotFoundException('존재하지 않은 사용자입니다.');
    return user;
  }

  async getUserByEmail(email: string): Promise<Nullable<User>> {
    const user = await this._loadUserPort.findByEmail(email);
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

  async getFollowers(query: GetFollowerQuery): Promise<Follower[]> {
    const followers = await this._loadUserPort.findFollowers(
      query.userId,
      query.onlyApproved,
    );
    return followers;
  }

  async update(id: number, options: Partial<User>): Promise<number | string> {
    const user = await this._loadUserPort.findById(id);
    if (!user) throw new NotFoundException('존재하지 않은 사용자입니다.');
    console.log(options);
    const result = await this._handleUserPort.update(options);
    return;
  }

  async updateUseCommand(command: UpdateUserCommand): Promise<number | string> {
    const user: User = await this._loadUserPort.findById(command.id);
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
    return await this._handleUserPort.saveFollow(
      command.followerId,
      command.followingId,
    );
  }
  async unfollow(command: UnfollowCommand) {
    const deletedCount = await this._handleUserPort.deleteFollow(
      command.followerId,
      command.followingId,
    );
    if (deletedCount > 1) {
      throw new BadRequestException('팔로우하지 않은 사용자');
    }
    return deletedCount;
  }
  async approveFollow(command: ApproveFollowCommand) {
    return await this._handleUserPort.saveFollow(
      command.followerId,
      command.followingId,
      true,
    );
  }
  async rejectFollow(command: RejectFollowCommand) {
    const deletedCount = await this._handleUserPort.deleteFollow(
      command.followerId,
      command.followingId,
    );
    if (deletedCount > 1) {
      throw new BadRequestException('팔로우하지 않은 사용자');
    }
    return deletedCount;
  }
}
