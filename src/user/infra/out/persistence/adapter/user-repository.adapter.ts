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
  UserProfile,
  PagedFollowUsers,
  PagedCursorBaseSearchUsers,
  PagedOffsetBaseSearchUsers,
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
   *   이벤트 기반 동기화
   *   페이지네이션
   * innerjoin -> 타겟 팔로워들 조회
   * leftjoin(viewer != target : leftjoin 2회)
   *   viewer == target: 조회 요청자(타겟이자 뷰어) -> 타겟 팔로워 간 팔로우 관계 조인
   *   viewer != target:
   *     조회 요청자(뷰어) -> 타겟 팔로워 간 팔로우 관계 조인
   *     타겟 팔로워 -> 조회 요청자(뷰어) 간 팔로우 관계 조인
   * */
  async findFollowers(
    viewerId: number,
    targetId: number,
    onlyApproved: boolean,
    limit: number,
    cursor: number,
  ): Promise<PagedFollowUsers> {
    const isSelfView = viewerId === targetId;

    const qb = this._followRepository
      .createQueryBuilder('f')
      .innerJoin('f.follower', 'followerUser', 'f.followingId = :targetId', {
        targetId,
      })
      .leftJoin(
        FollowEntity,
        'sentToFollower',
        'sentToFollower.followerId = :viewerId AND sentToFollower.followingId = followerUser.id',
        { viewerId },
      )
      .where(onlyApproved ? 'f.status = :approved' : '1=1', {
        approved: 'approved',
      })
      .select([
        'followerUser.id AS id',
        'followerUser.email AS email',
        'followerUser.nickname AS nickname',
        'followerUser.image AS image',
      ])
      .orderBy('f.followerId', 'DESC')
      .limit(limit + 1);

    if (cursor) {
      qb.andWhere('f.followerId < :cursor', { cursor });
    }

    if (isSelfView) {
      qb.addSelect('sentToFollower.status AS sent');
      qb.addSelect('f.status AS received');
    } else {
      qb.leftJoin(
        FollowEntity,
        'receivedFromFollower',
        'receivedFromFollower.followerId = followerUser.id AND receivedFromFollower.followingId = :viewerId',
        { viewerId },
      );
      qb.addSelect('sentToFollower.status AS sent');
      qb.addSelect('receivedFromFollower.status AS received');
    }

    const raws = await qb.getRawMany();
    const followers = raws.map((f) => {
      const { received, sent, ...rest } = f;
      return {
        user: rest,
        followStatus: {
          sent: sent ?? FollowRequestStatus.NONE,
          received: received ?? FollowRequestStatus.NONE,
        },
        isMutualFollow:
          sent === FollowStatus.APPROVED && received === FollowStatus.APPROVED,
      };
    });

    const sliced = followers.slice(0, limit);
    const hasNext = raws.length > limit;
    const marker = hasNext ? sliced[sliced.length - 1].user.id : null;
    return {
      items: sliced,
      limit,
      marker,
      hasNext,
    };
  }

  /**
   * @TODO
   *   이벤트 기반 동기화
   *   페이지네이션
   * innerjoin -> 타겟이 팔로잉하는 유저들 조회
   * leftjoin(viewer != target : leftjoin 2회)
   *   viewer == target: 타겟의 팔로잉 -> 조회 요청자(타겟이자 뷰어) 간 팔로우 관계 조인
   *   viewer != target:
   *     타겟의 팔로잉 -> 조회 요청자(뷰어) 간 팔로우 관계 조인
   *     조회 요청자(뷰어) -> 타겟의 팔로잉 간 팔로우 관계 조인
   * */
  async findFollowing(
    viewerId: number,
    targetId: number,
    onlyApproved: boolean,
    limit: number,
    cursor: number,
  ): Promise<PagedFollowUsers> {
    const isSelfView = viewerId === targetId;

    const qb = this._followRepository
      .createQueryBuilder('f')
      .innerJoin('f.following', 'followingUser', ' f.followerId = :targetId', {
        targetId,
      })
      .leftJoin(
        FollowEntity,
        'receivedFromFollowing',
        'receivedFromFollowing.followerId = followingUser.id AND receivedFromFollowing.followingId = :viewerId',
        {
          viewerId,
        },
      )
      .where(onlyApproved ? 'f.status = :approved' : '1=1', {
        approved: 'approved',
      })
      .select([
        'followingUser.id AS id',
        'followingUser.email AS email',
        'followingUser.nickname AS nickname',
        'followingUser.image AS image',
      ])
      .orderBy('f.followingId', 'DESC')
      .limit(limit + 1);

    if (cursor) {
      qb.andWhere('f.followingId < :cursor', { cursor });
    }

    if (isSelfView) {
      qb.addSelect('f.status AS sent');
      qb.addSelect('receivedFromFollowing.status AS received');
    } else {
      qb.leftJoin(
        FollowEntity,
        'sentToFollowing',
        'sentToFollowing.followerId = :viewerId AND sentToFollowing.followingId = followingUser.id',
        {
          viewerId,
        },
      );
      qb.addSelect('sentToFollowing.status AS sent');
      qb.addSelect('receivedFromFollowing.status AS received');
    }

    const raws = await qb.getRawMany();

    const followings = raws.map((f) => {
      const { sent, received, ...rest } = f;
      return {
        user: rest,
        followStatus: {
          sent: sent ?? FollowRequestStatus.NONE,
          received: received ?? FollowRequestStatus.NONE,
        },
        isMutualFollow:
          sent === FollowStatus.APPROVED && received === FollowStatus.APPROVED,
      };
    });

    const sliced = followings.slice(0, limit);
    const hasNext = raws.length > limit;
    const marker = hasNext ? sliced[sliced.length - 1].user.id : null;
    return {
      items: sliced,
      limit,
      marker,
      hasNext,
    };
  }

  async searchUsersByEmailOrNicknameUseOffset(
    keyword: string,
    limit: number,
    offset: number,
  ): Promise<PagedOffsetBaseSearchUsers> {
    const rows = await this._userRepository
      .createQueryBuilder('user')
      .where('user.nickname LIKE :keyword', { keyword: `${keyword}%` })
      .orWhere('user.email LIKE :keyword', { keyword: `${keyword}%` })
      .orderBy('user.nickname', 'ASC')
      .limit(limit)
      .offset(offset)
      .getMany();

    const nextOffset = offset + limit;
    const users = rows.map((user) => ({
      id: user.id,
      nickname: user.nickname,
      email: user.email,
    }));

    return {
      items: users,
      limit,
      marker: nextOffset,
    };
  }

  async searchUsersByEmailOrNicknameUseCursor(
    keyword: string,
    limit: number,
    cursor: string,
  ): Promise<PagedCursorBaseSearchUsers> {
    const rows = await this._userRepository
      .createQueryBuilder('user')
      .where('(user.nickname LIKE :keyword OR user.email LIKE :keyword)', {
        keyword: `${keyword}%`,
      })
      .andWhere(cursor.length > 0 ? 'user.nickname > :cursor' : '1=1', {
        cursor,
      })
      .orderBy('user.nickname', 'ASC')
      .limit(limit)
      .getMany();

    const nextCursor = rows.length ? rows[rows.length - 1].nickname : undefined;
    const users = rows.map((user) => ({
      id: user.id,
      nickname: user.nickname,
      email: user.email,
    }));

    return {
      items: users,
      limit,
      marker: nextCursor,
    };
  }
}
