import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCategoriesByUserIdQuery, GetCategoryQuery } from './category.query';
import { CategoryPrimitives } from '../../domain/model/category';
import {
  GetCategoryUseCase,
  GetCategoryUseCaseSymbol,
} from '../../domain/port/in/get-category.usecase';

@QueryHandler(GetCategoryQuery)
export class GetCategoryHandler
  implements IQueryHandler<GetCategoryQuery, CategoryPrimitives>
{
  constructor(
    @Inject(GetCategoryUseCaseSymbol)
    private readonly _getCategoryUseCase: GetCategoryUseCase,
  ) {}
  async execute(query: GetCategoryQuery): Promise<CategoryPrimitives> {
    return await this._getCategoryUseCase.getCategoryById(query);
  }
}

@QueryHandler(GetCategoriesByUserIdQuery)
export class GetCategoriesByUserIdHandler
  implements IQueryHandler<GetCategoriesByUserIdQuery, CategoryPrimitives[]>
{
  constructor(
    @Inject(GetCategoryUseCaseSymbol)
    private readonly _getCategoryUseCase: GetCategoryUseCase,
  ) {}
  async execute(
    query: GetCategoriesByUserIdQuery,
  ): Promise<CategoryPrimitives[]> {
    return await this._getCategoryUseCase.getCategoriesByUserId(query);
  }
}
