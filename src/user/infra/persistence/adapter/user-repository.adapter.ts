import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/user/domain/user';
import { UserEntity } from '../entity/user.entity';

import { CreateUserPort } from 'src/user/domain/port/create-user.port';

export class UserRepositoryAdapter implements CreateUserPort {
  constructor(
    @InjectRepository(UserEntity)
    private readonly _userRepository: Repository<UserEntity>,
  ) {}

  async saveUser(
    user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<number | string> {
    let userRecord: Omit<User, 'id' | 'createdAt' | 'updatedAt'> =
      new UserEntity();
    userRecord = { ...user };
    const savedUser = await this._userRepository.save(userRecord);
    return savedUser.id;
  }
}
