import {
  GetCategoriesByUserIdQuery,
  GetCategoryQuery,
} from '../../../application/query/category.query';
import { CategoryPrimitives } from '../../model/category';

export const GetCategoryUseCaseSymbol = Symbol('GetCategoryUseCase');
export interface GetCategoryUseCase {
  getCategoryById(query: GetCategoryQuery): Promise<CategoryPrimitives>;

  getCategoriesByUserId(
    query: GetCategoriesByUserIdQuery,
  ): Promise<CategoryPrimitives[]>;
}
