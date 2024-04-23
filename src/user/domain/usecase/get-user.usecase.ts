import { User } from '../user';

export interface GetUserUseCase {
  getUser(id: number): Promise<User | null>;
}
