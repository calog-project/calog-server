import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Nullable } from '../../../../../common/type/CommonType';
import { User } from 'src/user/domain/model/user';
import { UserEntity } from '../entity/user.entity';
import { FollowEntity } from '../entity/follow.entity';
import { UserMapper } from '../mapper/user.mapper';

import {
  FollowEntityReadModel,
  FollowRequestStatus,
  FollowStatus,
  FollowUser,
  SearchedUser,
  UserProfile,
} from '../../../../domain/model/user-read-model';

import { HandleUserPort } from 'src/user/domain/port/out/handle-user.port';
import { LoadUserPort } from 'src/user/domain/port/out/load-user.port';

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
    const follow = await this._followRepository.save({
      followerId,
      followingId,
      ...(isApproved && { status: FollowStatus.APPROVED }),
    });
    return follow.followerId;
  }

  async updateFollow(
    followerId: number,
    followingId: number,
    isApproved: boolean,
  ): Promise<number> {
    const updated = await this._followRepository.update(
      {
        followerId,
        followingId,
      },
      { status: FollowStatus.APPROVED },
    );
    return updated.affected;
  }

  async deleteFollow(followerId: number, followingId: number): Promise<number> {
    const deleted = await this._followRepository.delete({
      followerId,
      followingId,
    });
    return deleted.affected;
  }

  //LoadUserPort Implementation

  async loadUserAggregateById(id: number): Promise<Nullable<User>> {
    const user = await this._userRepository.findOneBy({ id });
    return user ? UserMapper.toDomain(user) : null;
  }

  async loadUserAggregateByEmail(email: string): Promise<Nullable<User>> {
    const user = await this._userRepository.findOneBy({ email });
    return user ? UserMapper.toDomain(user) : null;
  }

  /**
   * @TODO target, viewer가 동일할 때 조건분기
   *    본인 조회 분기 처리
   * */
  async findById(
    targetId: number,
    viewerId?: number,
  ): Promise<Nullable<UserProfile>> {
    const viewer = viewerId ?? targetId;

    const { entities, raw } = await this._userRepository
      .createQueryBuilder('user')
      .addSelect(
        (sub) =>
          sub
            .select('COUNT(*)')
            .from(FollowEntity, 'f1')
            .where('f1.followingId = user.id')
            .andWhere('f1.status = :approved', {
              approved: FollowStatus.APPROVED,
            }),
        'followerCount',
      )
      .addSelect(
        (sub) =>
          sub
            .select('COUNT(*)')
            .from(FollowEntity, 'f2')
            .where('f2.followerId = user.id')
            .andWhere('f2.status = :approved', {
              approved: FollowStatus.APPROVED,
            }),
        'followingCount',
      )
      .where('user.id = :id', { id: targetId })
      .getRawAndEntities();
    if (!entities.length) return null;

    const userEntity = entities[0];
    const counts = raw[0];

    let sent: FollowRequestStatus;
    let received: FollowRequestStatus;
    let isMutualFollow: boolean;

    if (viewer === targetId) {
      sent = FollowRequestStatus.NONE;
      received = FollowRequestStatus.NONE;
      isMutualFollow = false;
    } else {
      const relation = await this._followRepository.find({
        where: [
          { followerId: targetId, followingId: viewerId },
          { followerId: viewerId, followingId: targetId },
        ],
      });

      const statusMap = relation.reduce(
        (acc, { followerId, status }) => {
          acc[followerId === viewerId ? 'sent' : 'received'] = status;
          return acc;
        },
        {} as Record<'sent' | 'received', FollowStatus | undefined>,
      );

      sent = (statusMap.sent ??
        FollowRequestStatus.NONE) as FollowRequestStatus;
      received = (statusMap.received ??
        FollowRequestStatus.NONE) as FollowRequestStatus;
      isMutualFollow =
        sent === FollowRequestStatus.APPROVED &&
        received === FollowRequestStatus.APPROVED;
    }
    return {
      ...UserMapper.toReadModel(userEntity),
      followerCount: parseInt(counts.followerCount, 10),
      followingCount: parseInt(counts.followingCount, 10),
      followStatus: {
        sent,
        received,
      },
      isMutualFollow,
    };
  }

  //@TODO get follower, following count
  async findByIds(ids: number[]): Promise<UserProfile[]> {
    const user = await this._userRepository.findBy({ id: In(ids) });
    const userReadModels = UserMapper.toReadModels(user);
    return userReadModels.map((readModel) => ({
      ...readModel,
      followerCount: 1,
      followingCount: 1,
      followStatus: {
        sent: FollowRequestStatus.NONE,
        received: FollowRequestStatus.NONE,
      },
      isMutualFollow: true,
    }));
  }

  async findByEmail(email: string): Promise<Nullable<UserProfile>> {
    const user = await this._userRepository.findOneBy({ email });
    if (!user) return null;
    const userPrimitives = UserMapper.toReadModel(user);
    return {
      ...userPrimitives,
      followerCount: 1,
      followingCount: 1,
      followStatus: {
        sent: FollowRequestStatus.NONE,
        received: FollowRequestStatus.NONE,
      },
      isMutualFollow: true,
    };
  }

  async findByNickname(nickname: string): Promise<Nullable<User>> {
    const user = await this._userRepository.findOneBy({ nickname });
    return user ? UserMapper.toDomain(user) : null;
  }

  async findFollowRelation(
    followerId: number,
    followingId: number,
  ): Promise<FollowEntityReadModel | null> {
    return this._followRepository.findOneBy({
      followerId,
      followingId,
    });
  }

  /**
   * @TODO
   *   팔로워 조회 기능 주체(모든 유저 or 프로필 주인) 선택
   *   이벤트 기반 동기화
   *
   * innerjoin -> 팔로워들 조회
   * leftjoin -> 팔로워들 팔로잉 여부 조회
   * */
  async findFollowers(
    userId: number,
    onlyApproved: boolean,
  ): Promise<FollowUser[]> {
    const followers = await this._followRepository
      .createQueryBuilder('f')
      .innerJoin('f.follower', 'user') // 팔로워 유저 정보
      .leftJoin(
        FollowEntity,
        'reverse',
        'reverse.followerId = :myId AND reverse.followingId = user.id',
        { myId: userId },
      )
      .where('f.followingId = :myId', { myId: userId })
      .andWhere(onlyApproved ? 'f.status = approved' : '1=1')
      .select([
        'user.id AS id',
        'user.email AS email',
        'user.nickname AS nickname',
        'user.image AS image',
        'f.status AS received',
        'reverse.status AS sent',
      ])
      .getRawMany();

    return followers.map((f) => {
      const { received, sent, ...rest } = f;
      return {
        user: rest,
        followStatus: {
          sent: sent ?? FollowRequestStatus.NONE,
          received,
        },
        isMutualFollow:
          sent === FollowStatus.APPROVED && received === FollowStatus.APPROVED,
      };
    });
  }

  /**
   * @TODO
   *   query의 id 여부에 따라 본인, 타인 조회
   *   이벤트 기반 동기화
   *
   * 팔로잉하는 사람들 조회
   * inner join -> 팔로잉 조회
   * left join -> 팔로잉들의 팔로워 여부 조회
   */
  async findFollowing(
    userId: number,
    onlyApproved: boolean,
  ): Promise<FollowUser[]> {
    const followings = await this._followRepository
      .createQueryBuilder('f')
      .innerJoin('f.following', 'user')
      .leftJoin(
        FollowEntity,
        'reverse',
        'reverse.followerId = user.id AND reverse.followingId = :myId',
        { myId: userId },
      )
      .where('f.followerId = :myId', { myId: userId })
      .andWhere(onlyApproved ? 'f.status = approved' : '1=1')
      .select([
        'user.id AS id',
        'user.email AS email',
        'user.nickname AS nickname',
        'user.image AS image',
        'f.status AS sent',
        'reverse.status AS received',
      ])
      .getRawMany();

    return followings.map((f) => {
      const { sent, received, ...rest } = f;
      return {
        user: rest,
        followStatus: {
          sent,
          received: received ?? FollowRequestStatus.NONE,
        },
        isMutualFollow:
          sent === FollowStatus.APPROVED && received === FollowStatus.APPROVED,
      };
    });
  }

  async searchUsersByEmailOrNickname(
    keyword: string,
    limit: number = 10,
    offset: number = 0,
  ): Promise<SearchedUser[]> {
    const users = await this._userRepository
      .createQueryBuilder('user')
      .where('user.nickname LIKE :keyword', { keyword: `${keyword}%` })
      .orWhere('user.email LIKE :keyword', { keyword: `${keyword}%` })
      .orderBy('user.nickname', 'ASC')
      .limit(limit)
      .offset(offset)
      .getMany();

    return users.map((user) => {
      return { id: user.id, nickname: user.nickname, email: user.email };
    });
  }
}
