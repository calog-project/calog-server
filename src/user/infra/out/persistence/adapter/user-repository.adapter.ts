import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Nullable } from 'src/common/type/CommonType';
import { User, UserPrimitives } from 'src/user/domain/model/user';
import { UserEntity } from '../entity/user.entity';
import { UserMapper } from '../mapper/user.mapper';

import { HandleUserPort } from 'src/user/domain/port/out/handle-user.port';
import { LoadUserPort } from 'src/user/domain/port/out/load-user.port';
import { FollowEntity } from '../entity/follow.entity';
import {
  FollowUser, SearchedUser, UserSummary,
} from '../../../../domain/model/user-read-model';

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
      isApproved: isApproved ? isApproved : false,
    });
    return;
  }

  async deleteFollow(followerId: number, followingId: number): Promise<number> {
    const deleted = await this._followRepository.delete({
      followerId,
      followingId,
    });
    return deleted.affected;
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

  /**
   * @TODO 테이블 정규화(맞팔여부)
   *   팔로우 테이블 isMutualFollow 필드 추가
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
        { myId: userId })
      .where('f.followingId = :myId', { myId: userId })
      .andWhere(onlyApproved ? 'f.isApproved = true' : '1=1')
      .select([
        'user.id AS id',
        'user.email AS email',
        'user.nickname AS nickname',
        'user.image AS image',
        'f.isApproved AS isApproved',
        `CASE 
          WHEN reverse.followerId IS NOT NULL 
            AND reverse.isApproved = true 
            AND f.isApproved = true 
          THEN true 
          ELSE false 
         END AS isMutualFollow`,
      ])
      .getRawMany();
    console.log(followers)

    return followers.map((follower) => {
      const { isApproved, isMutualFollow, ...rest} = follower
      return {
        user: rest as UserSummary,
        isApproved : Boolean(isApproved),
        isMutualFollow: Boolean(parseInt(isMutualFollow)),
      }
    })
  }

  /**
   * @TODO 테이블 정규화(맞팔여부)
   *   팔로우 테이블 isMutualFollow 필드 추가
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
        { myId: userId })
      .where('f.followerId = :myId', { myId : userId })
      .andWhere(onlyApproved ? 'f.isApproved = true' : '1=1')
      .select([
        'user.id AS id',
        'user.email AS email',
        'user.nickname AS nickname',
        'user.image AS image',
        'f.isApproved AS isApproved',
        `CASE 
          WHEN reverse.followerId IS NOT NULL 
            AND reverse.isApproved = true 
            AND f.isApproved = true 
          THEN true 
          ELSE false 
         END AS isMutualFollow`,
      ])
      .getRawMany();

    return followings.map((following) => {
      const { isApproved, isMutualFollow, ...rest} = following
      return {
        user: rest as UserSummary,
        isApproved : Boolean(isApproved),
        isMutualFollow: Boolean(parseInt(isMutualFollow)),
      }
    })
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
