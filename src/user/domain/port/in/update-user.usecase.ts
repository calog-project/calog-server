import { User } from 'src/user/domain/model/user';
import { UpdateUserCommand } from '../../../application/command/user.command';

export const UpdateUserUseCaseSymbol = Symbol('UpdateUserUseCase');

export interface UpdateUserUseCase {
  update(id: number, options: Partial<User>): Promise<number | string>;
  updateUseCommand(command: UpdateUserCommand): Promise<number | string>;
}
