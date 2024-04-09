import { CreateUserDto } from 'src/user/application/dto/user.input';
import { User } from '../user';

export const CreateUseCaseSymbol = Symbol('CreateUseCase');
export interface CreateUserUseCase {
  createUser(dto: CreateUserDto): Promise<{ id: number }>;
}
