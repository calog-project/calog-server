import { DeleteCategoryCommand } from '../../../application/command/category.command';

export const DeleteCategoryUseCaseSymbol = Symbol('DeleteCategoryUseCase');
export interface DeleteCategoryUseCase {
  deleteCategory(command: DeleteCategoryCommand): Promise<number>;
}
