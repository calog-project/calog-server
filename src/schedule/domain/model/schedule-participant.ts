import { ParticipantRole, ParticipantStatus } from './schedule-read-model';
import { AggregateRoot } from '../../../common/domain/aggregate-root';
import { UniqueID } from '../../../common/domain/unique-id';
import { DomainError } from '../../../common/domain/domain-error';

interface ScheduleParticipantProps {
  id?: UniqueID;
  scheduleId: number;
  userId: number;
  role: ParticipantRole;
  status: ParticipantStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ScheduleParticipantPrimitives {
  id: string;
  scheduleId: number;
  userId: number;
  role: ParticipantRole;
  status: ParticipantStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

export class ScheduleParticipant extends AggregateRoot<ScheduleParticipantProps> {
  constructor(props: ScheduleParticipantProps) {
    super(props, props.id);
  }

  static create(props: ScheduleParticipantPrimitives) {
    const id = new UniqueID(props.id);
    const role = props.role ?? ParticipantRole.HOST;
    const status = props.status ?? ParticipantStatus.INVITED;
    return new ScheduleParticipant({
      ...props,
      id,
      role,
      status,
    });
  }

  accept() {
    if (this.props.status !== ParticipantStatus.INVITED) {
      throw new DomainError('참여자의 상태 확인');
    }
    this.props.status = ParticipantStatus.ACCEPTED;
  }

  reject() {
    if (this.props.status !== ParticipantStatus.INVITED) {
      throw new DomainError('참여자의 상태 확인');
    }
    this.props.status = ParticipantStatus.REJECTED;
  }
}
