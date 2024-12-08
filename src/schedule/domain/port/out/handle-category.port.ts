import { Category } from '../../model/category';

export const HandleCategoryPortSymbol = Symbol('HandleCategoryPort');
export interface HandleCategoryPort {
  save(
    category: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<number>;
}
