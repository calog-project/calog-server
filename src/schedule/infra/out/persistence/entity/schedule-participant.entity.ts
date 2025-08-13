import {
  Column,
  Unique,
  Entity,
  Index,
  PrimaryColumn,
  ManyToOne,
} from 'typeorm';
import {
  ParticipantStatus,
  ParticipantRole,
} from '../../../../domain/model/schedule-read-model';
import { ScheduleEntity } from './schedule.entity';
import { UserEntity } from '../../../../../user/infra/out/persistence/entity/user.entity';

@Entity('schedule_participant')
@Unique('uq_schedule_user', ['scheduleId', 'userId'])
export class ScheduleParticipantEntity {
  @PrimaryColumn('uuid') id: string;

  @Column()
  @Index()
  scheduleId: number;

  @Column()
  @Index()
  userId: number;

  @Column('enum', { enum: ParticipantRole, default: ParticipantRole.GUEST })
  role: ParticipantRole;

  @Column('enum', {
    enum: ParticipantStatus,
    default: ParticipantStatus.INVITED,
  })
  status: ParticipantStatus;

  @ManyToOne(() => ScheduleEntity)
  schedule: ScheduleEntity;

  @ManyToOne(() => UserEntity)
  user: UserEntity;
}
