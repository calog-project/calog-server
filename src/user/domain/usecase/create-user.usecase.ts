import { User } from '../user';

export const CreateUseCaseSymbol = Symbol('CreateUseCase');

/**
 * @TODO
 * mapper의 update용 메소드가 정의되지 않아서 임시적으로 partial타입으로 지정
 * Omit으로 교체 예정
 */
export interface CreateUserUseCase {
  createUser(user: Partial<User>): Promise<number | string>;
}
