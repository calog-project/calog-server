import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import {
  Category,
  CategoryPrimitives,
} from '../../../../domain/model/category';
import { CategoryEntity } from '../entity/category.entity';

import { HandleCategoryPort } from '../../../../domain/port/out/handle-category.port';
import { LoadCategoryPort } from '../../../../domain/port/out/load-category.port';

import { CategoryMapper } from '../mapper/category.mapper';

export class CategoryRepositoryAdapter
  implements HandleCategoryPort, LoadCategoryPort
{
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly _categoryRepository: Repository<CategoryEntity>,
  ) {}

  async save(
    category: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<number> {
    const savedCategory = await this._categoryRepository.save(
      CategoryMapper.toOrmEntity(category),
    );
    return savedCategory.id;
  }

  async upsert(
    category: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<number> {
    const savedCategory = await this._categoryRepository.upsert(
      CategoryMapper.toOrmEntity(category),
      {
        conflictPaths: ['userId', 'name'],
      },
    );
    console.log(savedCategory);
    return 1;
  }

  async update(category: Partial<Category>): Promise<number> {
    const categoryEntity = CategoryMapper.toOrmEntity(category);
    const updated = await this._categoryRepository
      .createQueryBuilder()
      .update()
      .set({ ...categoryEntity })
      .where('id = :id', { id: categoryEntity.id })
      .execute();
    return categoryEntity.id;
  }
  async delete(id: number): Promise<number> {
    const deletedCategory = await this._categoryRepository.delete({ id });
    return id;
  }

  async findById(id: number): Promise<CategoryPrimitives> {
    const category = await this._categoryRepository.findOneBy({ id });
    return category ? CategoryMapper.toReadModel(category) : null;
  }

  async findByUserId(userId: number): Promise<CategoryPrimitives[]> {
    const category = await this._categoryRepository.findBy({ userId });
    return category.length > 0 ? CategoryMapper.toReadModels(category) : null;
  }

  async findByUserIdAndCategoryName(
    userId: number,
    name: string,
  ): Promise<CategoryPrimitives> {
    const category = await this._categoryRepository.findOneBy({ userId, name });
    return category ? CategoryMapper.toReadModel(category) : null;
  }
}
