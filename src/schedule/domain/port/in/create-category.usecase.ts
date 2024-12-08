import { CreateCategoryCommand } from '../../../application/command/category.command';

export const CreateCategoryUseCaseSymbol = Symbol('CreateCategoryUseCase');
export interface CreateCategoryUseCase {
  createCategory(command: CreateCategoryCommand): Promise<number>;
}
