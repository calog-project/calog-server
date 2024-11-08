import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleEntity } from './entity/schedule.entity';
import { ScheduleRepositoryAdapter } from './adapter/schedule-repository.adatper';

@Module({
  imports: [TypeOrmModule.forFeature([ScheduleEntity])],
  providers: [ScheduleRepositoryAdapter],
  exports: [ScheduleRepositoryAdapter],
})
export class SchedulePersistenceModule {}
