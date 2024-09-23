import { User } from 'src/user/domain/model/user';

export const CreateUserUseCaseSymbol = Symbol('CreateUserUseCase');

/**
 * @TODO
 * update용 매퍼가 정의되지 않아서 임시적으로 partial타입으로 지정
 * mapper에 update용 매퍼 추가 후 Omit으로 파라미터 타입 교체 예정
 */
export interface CreateUserUseCase {
  createUser(
    user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<number | string>;
}
