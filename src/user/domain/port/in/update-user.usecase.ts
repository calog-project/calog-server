import { User } from '../../user';

export const UpdateUserUseCaseSymbol = Symbol('UpdateUserUseCase');

export interface UpdateUserUseCase {
  update(): Promise<void>;
}
