import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';

import { Category, CategoryPrimitives } from '../../domain/model/category';

import { CreateCategoryUseCase } from '../../domain/port/in/create-category.usecase';
import { UpdateCategoryUseCase } from '../../domain/port/in/update-category.usecase';
import { DeleteCategoryUseCase } from '../../domain/port/in/delete-category.usecase';
import {
  CreateCategoryCommand,
  DeleteCategoryCommand,
  UpdateCategoryCommand,
} from '../command/category.command';
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
  implements
    CreateCategoryUseCase,
    GetCategoryUseCase,
    UpdateCategoryUseCase,
    DeleteCategoryUseCase
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

  async updateCategory(command: UpdateCategoryCommand): Promise<number> {
    if (!command.name && !command.color)
      throw new BadRequestException('잘못된 값이 전달 되었습니다');
    const category = await this._loadCategoryPort.findById(command.id);
    if (!category)
      throw new BadRequestException('존재하지 않는 카테고리입니다');
    const updateCategory = Category.create({ ...category });
    updateCategory.changeName(command.name);
    updateCategory.changeColor(command.color);
    return await this._handleCategoryPort.update(command.id, updateCategory);
  }

  async deleteCategory(command: DeleteCategoryCommand): Promise<number> {
    const deletedId = await this._handleCategoryPort.delete(command.id);
    if (!deletedId)
      throw new InternalServerErrorException('서버에 문제가 발생했습니다');
    return deletedId;
  }
}
