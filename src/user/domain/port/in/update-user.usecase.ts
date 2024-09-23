import { User } from 'src/user/domain/model/user';

export const UpdateUserUseCaseSymbol = Symbol('UpdateUserUseCase');

export interface UpdateUserUseCase {
  update(): Promise<void>;
}
