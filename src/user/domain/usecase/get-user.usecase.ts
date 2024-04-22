import { User } from '../user';

export interface GetUserUseCase {
  findOne(userId?: number): Promise<User | void>;
}
