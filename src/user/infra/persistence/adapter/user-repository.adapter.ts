import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/user/domain/user';
import { UserEntity } from '../entity/user.entity';
import { UserMapper } from '../mapper/user.mapper';

import { CreateUserPort } from 'src/user/domain/port/create-user.port';

export class UserRepositoryAdapter implements CreateUserPort {
  constructor(
    @InjectRepository(UserEntity)
    private readonly _userRepository: Repository<UserEntity>,
  ) {}
  async saveUser(
    user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<number | string> {
    const savedUser = await this._userRepository.save(
      UserMapper.toOrmEntity(user),
    );
    return savedUser.id;
  }
}
