import { User } from '../../user';

export const HandleUserPortSymbol = Symbol('HandleUserPort');

export interface HandleUserPort {
  save(
    user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<number | string>;
  //   update()
  //   delete()
}
