import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ScheduleEntity } from './schedule.entity';
import { CategoryEntity } from './category.entity';

@Entity('user_category_schedule')
export class UserCategoryScheduleEntity {
  @PrimaryColumn()
  userId: number;

  @PrimaryColumn()
  categoryId: number;

  @PrimaryColumn()
  scheduleId: number;

  @ManyToOne(() => ScheduleEntity)
  @JoinColumn({ name: 'scheduleId' })
  schedule: ScheduleEntity;

  @ManyToOne(() => CategoryEntity)
  @JoinColumn({ name: 'categoryId' })
  category: CategoryEntity;
}
