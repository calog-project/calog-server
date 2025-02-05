import { User } from '../../model/user';

export const HandleUserPortSymbol = Symbol('HandleUserPort');

export interface HandleUserPort {
  save(
    user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<number | string>;
  update(user: Partial<User>): Promise<number | string>;

  // delete()

  saveFollow(followerId: number, followingId: number): Promise<number>;

  deleteFollow(followerId: number, followingId: number): Promise<number>;
}
