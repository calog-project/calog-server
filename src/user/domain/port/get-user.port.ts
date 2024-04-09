import { CreateUserDto } from 'src/user/application/dto/user.input';
import { UserEntity } from 'src/user/infra/persistence/entity/user.entity';

export interface GetUserPort {
  getUserByEmail(): Promise<UserEntity>;
}
