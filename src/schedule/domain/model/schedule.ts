import { AggregateRoot } from '../../../common/domain/aggregate-root';
import { ScheduleCreatedEvent } from '../schedule-created.event';
import { UniqueID } from '../../../common/domain/unique-id';
import { Period } from './period';
import { DomainError } from '../../../common/domain/domain-error';

/**
 * @TODO
 *    마지막 수정 이력
 *    카테고리 생성
 * */
interface ScheduleProps {
  aggregateId?: UniqueID;
  id?: number;
  author: number;
  title: string;
  period: Period;
  joiner: number[];
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
  joiner?: number[];
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
    const joiner = props.joiner?.length ? props.joiner : [];
    const schedule = new Schedule({
      ...otherProps,
      period,
      aggregateId,
      joiner,
    });
    if (schedule) {
      schedule.completeCreate();
    }
    return schedule;
  }

  private completeCreate(): void {
    this.addEvent(
      new ScheduleCreatedEvent(
        this.id.toString(),
        this.props.author,
        this.props.joiner,
        this.props.title,
      ),
    );
  }

  //일정 수정
  //  참여자 수정, 일정 내용 수정, 카테고리 수정
  //
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
