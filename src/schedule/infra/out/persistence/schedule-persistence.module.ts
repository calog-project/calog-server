import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleEntity } from './entity/schedule.entity';
import { CategoryEntity } from './entity/category.entity';
import { ScheduleRepositoryAdapter } from './adapter/schedule-repository.adapter';
import { UserCategoryScheduleEntity } from './entity/user-category-schedule.entity';
import { CategoryRepositoryAdapter } from './adapter/category-repository.adapter';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ScheduleEntity,
      CategoryEntity,
      UserCategoryScheduleEntity,
    ]),
  ],
  providers: [ScheduleRepositoryAdapter, CategoryRepositoryAdapter],
  exports: [ScheduleRepositoryAdapter, CategoryRepositoryAdapter],
})
export class SchedulePersistenceModule {}
