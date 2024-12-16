import { OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryEntity } from './entity/category.entity';

export class DefaultCategoryInitializeService
  implements OnApplicationBootstrap
{
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly _categoryRepository: Repository<CategoryEntity>,
  ) {}
  async onApplicationBootstrap() {
    await this.ensureDefaultCategories();
  }

  private async ensureDefaultCategories() {
    const personalCategory = await this._categoryRepository.findOne({
      where: { name: '기본', userId: -1 },
    });
    if (!personalCategory) {
      await this._categoryRepository.insert({
        id: 1,
        aggregateId: 'defaultPersonalCategory',
        userId: -1,
        name: '기본',
        color: '#DDDDDD',
      });
    }
    const sharedCategory = await this._categoryRepository.findOne({
      where: { name: '공유', userId: -1 },
    });
    if (!sharedCategory) {
      await this._categoryRepository.insert({
        id: 2,
        aggregateId: 'defaultSharedCategory',
        userId: -1,
        name: '공유',
        color: '#DDDDDD',
      });
    }
  }
}
