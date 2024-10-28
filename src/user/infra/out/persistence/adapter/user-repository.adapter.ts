import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Nullable } from 'src/common/type/CommonType';
import { User } from 'src/user/domain/model/user';
import { UserEntity } from '../entity/user.entity';
import { UserMapper } from '../mapper/user.mapper';

import { HandleUserPort } from 'src/user/domain/port/out/handle-user.port';
import { LoadUserPort } from 'src/user/domain/port/out/load-user.port';

export class UserRepositoryAdapter implements HandleUserPort, LoadUserPort {
  constructor(
    @InjectRepository(UserEntity)
    private readonly _userRepository: Repository<UserEntity>,
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

  async update(id: number, options: Partial<User>): Promise<number | string> {
    const user = await this._userRepository
      .createQueryBuilder()
      .update()
      .set({ ...UserMapper.toOrmEntity(options) })
      .where('id = :id', { id })
      .execute();
    console.log(user);
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
}
