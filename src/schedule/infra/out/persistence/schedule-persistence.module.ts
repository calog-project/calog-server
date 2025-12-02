import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleEntity } from './entity/schedule.entity';
import { ScheduleParticipantEntity } from './entity/schedule-participant.entity';
import { CategoryEntity } from './entity/category.entity';
import { ScheduleRepositoryAdapter } from './adapter/schedule-repository.adapter';
import { ScheduleParticipantRepositoryAdapter } from './adapter/schedule-participant-repository.adapter';
import { CategoryRepositoryAdapter } from './adapter/category-repository.adapter';
import { DefaultCategoryInitializeService } from './default-category-initialize.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ScheduleEntity,
      ScheduleParticipantEntity,
      CategoryEntity,
    ]),
  ],
  providers: [
    DefaultCategoryInitializeService,
    ScheduleRepositoryAdapter,
    ScheduleParticipantRepositoryAdapter,
    CategoryRepositoryAdapter,
  ],
  exports: [
    ScheduleRepositoryAdapter,
    ScheduleParticipantRepositoryAdapter,
    CategoryRepositoryAdapter,
  ],
})
export class SchedulePersistenceModule {}
