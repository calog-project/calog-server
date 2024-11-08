import { AggregateRoot } from '../../../common/domain/aggregate-root';
import { ScheduleCreatedEvent } from '../schedule-created.event';
import { UniqueID } from '../../../common/domain/unique-id';
import { Period } from './period';

interface ScheduleProps {
  aggregateId?: UniqueID;
  id?: number;
  author: number;
  title: string;
  period: Period;
  category: string;
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
  category?: string;
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
    const period = Period.create(start, end);
    const category = props.category ?? 'default';
    const joiner = props.joiner?.length ? props.joiner : [];
    const schedule = new Schedule({
      ...otherProps,
      period,
      aggregateId,
      category,
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
