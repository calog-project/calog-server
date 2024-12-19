import { Entity, PrimaryColumn, ManyToOne, Index } from 'typeorm';
import { ScheduleEntity } from './schedule.entity';
import { CategoryEntity } from './category.entity';

@Entity('user_category_schedule')
export class UserCategoryScheduleEntity {
  @PrimaryColumn()
  @Index()
  userId: number;

  @PrimaryColumn()
  categoryId: number;

  @PrimaryColumn()
  scheduleId: number;

  @ManyToOne(() => ScheduleEntity)
  schedule: ScheduleEntity;

  @ManyToOne(() => CategoryEntity)
  category: CategoryEntity;
}
