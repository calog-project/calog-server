import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';

import { Category, CategoryPrimitives } from '../../domain/model/category';

import { CreateCategoryUseCase } from '../../domain/port/in/create-category.usecase';
import { CreateCategoryCommand } from '../command/category.command';
import { GetCategoryUseCase } from '../../domain/port/in/get-category.usecase';
import {
  GetCategoriesByUserIdQuery,
  GetCategoryQuery,
} from '../query/category.query';

import {
  HandleCategoryPortSymbol,
  HandleCategoryPort,
} from '../../domain/port/out/handle-category.port';
import {
  LoadCategoryPortSymbol,
  LoadCategoryPort,
} from '../../domain/port/out/load-category.port';

@Injectable()
export class CategoryService
  implements CreateCategoryUseCase, GetCategoryUseCase
{
  constructor(
    @Inject(HandleCategoryPortSymbol)
    private readonly _handleCategoryPort: HandleCategoryPort,
    @Inject(LoadCategoryPortSymbol)
    private readonly _loadCategoryPort: LoadCategoryPort,
    private readonly _eventBud: EventBus,
  ) {}

  async createCategory(command: CreateCategoryCommand): Promise<number> {
    const isExistsName =
      await this._loadCategoryPort.findByUserIdAndCategoryName(
        command.userId,
        command.name,
      );
    if (isExistsName)
      throw new BadRequestException('이미 존재하는 카테고리입니다');

    const category = Category.create({ ...command });
    return await this._handleCategoryPort.save(category);
  }

  async getCategoryById(query: GetCategoryQuery): Promise<CategoryPrimitives> {
    const category = await this._loadCategoryPort.findById(query.id);
    if (!category) throw new NotFoundException('카테고리가 존재하지 않습니다');
    return category;
  }

  async getCategoriesByUserId(
    query: GetCategoriesByUserIdQuery,
  ): Promise<CategoryPrimitives[]> {
    const categories = await this._loadCategoryPort.findByUserId(query.userId);
    if (!categories)
      throw new NotFoundException('카테고리가 존재하지 않습니다');
    return categories;
  }
}
