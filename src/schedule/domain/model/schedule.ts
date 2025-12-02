import { AggregateRoot } from '../../../common/domain/aggregate-root';
import { ScheduleCreatedEvent } from '../schedule-created.event';
import { UniqueID } from '../../../common/domain/unique-id';
import { Period } from './period';
import { DomainError } from '../../../common/domain/domain-error';
import { ScheduleInvitedEvent } from '../schedule-invited.event';

/**
 * @TODO
 *    마지막 수정 이력
 *    카테고리 생성
 *    일정 조회 수정 Joiner 필드 제거,
 *
 * */
interface ScheduleProps {
  aggregateId?: UniqueID;
  id?: number;
  author: number;
  title: string;
  period: Period;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SchedulePrimitives {
  aggregateId?: string;
  id?: number;
  author: number;
  title: string;
  start: Date;
  end: Date;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Schedule extends AggregateRoot<ScheduleProps> {
  constructor(props: ScheduleProps) {
    super(props, props.aggregateId, props.id);
  }

  static create(props: SchedulePrimitives) {
    const { start, end, ...otherProps } = props;
    const aggregateId = new UniqueID(props.aggregateId);
    const period = Period.create(new Date(start), new Date(end));
    return new Schedule({
      ...otherProps,
      period,
      aggregateId,
    });
  }

  changeTitle(title: string): void {
    if (title) this.props.title = title;
  }

  changePeriod(start: Date, end: Date): void {
    if (start && end)
      this.props.period = Period.create(new Date(start), new Date(end));
  }

  changeDescription(description: string): void {
    if (description) this.props.description = description;
  }

  toPrimitives(): SchedulePrimitives {
    const { period, ...propsWithoutPeriod } = this.props;
    const periodPrimitives = period.getValue();
    return {
      ...propsWithoutPeriod,
      aggregateId: this.id.toString(),
      start: periodPrimitives.start,
      end: periodPrimitives.end,
    };
  }
}
