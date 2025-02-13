import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Nullable } from 'src/common/type/CommonType';
import { User, UserPrimitives } from 'src/user/domain/model/user';
import { UserEntity } from '../entity/user.entity';
import { UserMapper } from '../mapper/user.mapper';

import { HandleUserPort } from 'src/user/domain/port/out/handle-user.port';
import { LoadUserPort } from 'src/user/domain/port/out/load-user.port';
import { FollowEntity } from '../entity/follow.entity';
import { Follower, Following } from '../../../../domain/model/user-read-model';

export class UserRepositoryAdapter implements HandleUserPort, LoadUserPort {
  constructor(
    @InjectRepository(UserEntity)
    private readonly _userRepository: Repository<UserEntity>,
    @InjectRepository(FollowEntity)
    private readonly _followRepository: Repository<FollowEntity>,
  ) {}
  //HandleUserPort Implementation
  async save(
    user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<number | string> {
    const savedUser = await this._userRepository.save(
      UserMapper.toOrmEntity(user),
    );
    return savedUser.id;
  }

  async update(user: Partial<User>): Promise<number | string> {
    const userEntity = UserMapper.toOrmEntity(user);
    const updated = await this._userRepository
      .createQueryBuilder()
      .update()
      .set({ ...userEntity })
      .where('id = :id', { id: userEntity.id })
      .execute();
    return userEntity.id;
  }

  async saveFollow(
    followerId: number,
    followingId: number,
    isApproved?: boolean,
  ): Promise<number> {
    const a = await this._followRepository.save({
      followerId,
      followingId,
      isApproved: isApproved ? isApproved : null,
    });
    return;
  }

  async deleteFollow(followerId: number, followingId: number): Promise<number> {
    await this._followRepository.delete({ followerId, followingId });
    return;
  }

  //LoadUserPort Implementation
  async findById(id: number): Promise<Nullable<User>> {
    const user = await this._userRepository.findOneBy({ id });
    return user ? UserMapper.toDomain(user) : null;
  }

  async findByIds(ids: number[]): Promise<Nullable<User[]>> {
    const user = await this._userRepository.findBy({ id: In(ids) });
    return user.length > 0 ? UserMapper.toDomains(user) : null;
  }

  async findByEmail(email: string): Promise<Nullable<User>> {
    const user = await this._userRepository.findOneBy({ email });
    return user ? UserMapper.toDomain(user) : null;
  }

  async findByNickname(nickname: string): Promise<Nullable<User>> {
    const user = await this._userRepository.findOneBy({ nickname });
    return user ? UserMapper.toDomain(user) : null;
  }

  async findFollowers(
    userId: number,
    onlyApproved: boolean,
  ): Promise<Follower[]> {
    const where = { followingId: userId };
    if (onlyApproved) {
      where['isApproved'] = true;
    }
    const followEntities = await this._followRepository.find({
      where: where,
      relations: {
        follower: true,
      },
    });
    return followEntities.map((e) => ({
      isApproved: e.isApproved,
      follower: UserMapper.toReadModel(e.follower),
    }));
  }

  async findFollowing(
    userId: number,
    onlyApproved: boolean,
  ): Promise<Following[]> {
    const where = { followerId: userId };
    if (onlyApproved) {
      where['isApproved'] = true;
    }
    const followEntities = await this._followRepository.find({
      where: where,
      relations: {
        following: true,
      },
    });
    return followEntities.map((e) => ({
      isApproved: e.isApproved,
      following: UserMapper.toReadModel(e.following),
    }));
  }
}
