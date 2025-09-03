import {
  Column,
  Unique,
  Entity,
  Index,
  PrimaryColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  ParticipantStatus,
  ParticipantRole,
} from '../../../../domain/model/schedule-read-model';
import { ScheduleEntity } from './schedule.entity';
import { UserEntity } from '../../../../../user/infra/out/persistence/entity/user.entity';
import { CategoryEntity } from './category.entity';

@Entity('schedule_participant')
@Unique(['scheduleId', 'userId'])
@Index(['userId', 'status'])
@Index(['userId', 'categoryId', 'status'])
@Index(['scheduleId', 'status'])
@Index(['scheduleId', 'categoryId'])
export class ScheduleParticipantEntity {
  @PrimaryColumn('uuid') id: string;

  @Column()
  @Index()
  scheduleId: number;

  @Column()
  @Index()
  userId: number;

  @Column()
  @Index()
  categoryId: number;

  @Column('enum', { enum: ParticipantRole, default: ParticipantRole.GUEST })
  role: ParticipantRole;

  @Column('enum', {
    enum: ParticipantStatus,
    default: ParticipantStatus.INVITED,
  })
  status: ParticipantStatus;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @ManyToOne(() => ScheduleEntity)
  schedule: ScheduleEntity;

  @ManyToOne(() => UserEntity)
  user: UserEntity;

  @ManyToOne(() => CategoryEntity)
  category: CategoryEntity;
}
