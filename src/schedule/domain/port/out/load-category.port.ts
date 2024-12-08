import { CategoryPrimitives } from '../../model/category';

export const LoadCategoryPortSymbol = Symbol('LoadCategoryPort ');
export interface LoadCategoryPort {
  findById(id: number): Promise<CategoryPrimitives>;

  findByUserId(userId: number): Promise<CategoryPrimitives[]>;

  findByUserIdAndCategoryName(
    userId: number,
    name: string,
  ): Promise<CategoryPrimitives>;
}
