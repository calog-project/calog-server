import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Nullable } from 'src/common/type/CommonType';
import { User } from 'src/user/domain/user';
import { UserEntity } from '../entity/user.entity';
import { UserMapper } from '../mapper/user.mapper';

import { CreateUserPort } from 'src/user/domain/port/out/create-user.port';
import { LoadUserPort } from 'src/user/domain/port/out/load-user.port';

export class UserRepositoryAdapter implements CreateUserPort, LoadUserPort {
  constructor(
    @InjectRepository(UserEntity)
    private readonly _userRepository: Repository<UserEntity>,
  ) {}
  async save(
    user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<number | string> {
    const savedUser = await this._userRepository.save(
      UserMapper.toOrmEntity(user),
    );
    return savedUser.id;
  }

  async findById(id: number): Promise<Nullable<User>> {
    const user = await this._userRepository.findOneBy({ id });
    return user ? UserMapper.toDomain(user) : null;
  }

  async findByEmail(email: string): Promise<Nullable<User>> {
    const user = await this._userRepository.findOneBy({ email });
    return user ? UserMapper.toDomain(user) : null;
  }
}
