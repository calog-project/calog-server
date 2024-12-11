import { UpdateCategoryCommand } from '../../../application/command/category.command';

export const UpdateCategoryUseCaseSymbol = Symbol('UpdateCategoryUseCase');
export interface UpdateCategoryUseCase {
  updateCategory(command: UpdateCategoryCommand): Promise<number>;
}
