import { DateTimeVO } from '../../../common/domain/datetime';

interface PeriodProps {
  start: Date;
  end: Date;
}

export class Period extends DateTimeVO<PeriodProps> {
  constructor(props: PeriodProps) {
    super(props);
  }

  getValue(): PeriodProps {
    return {
      start: new Date(this.props.start),
      end: new Date(this.props.end),
    };
  }

  private static isValidPeriod(start: Date, end: Date): boolean {
    if (!(Date.parse(start.toString()) <= Date.parse(end.toString())))
      throw new Error('입력값이 잘못되었습니다');
    else return true;
  }

  static create(start: Date, end: Date): Period {
    const validateDate = this.isValidDate(start) && this.isValidDate(end);
    const validatePeriod = this.isValidPeriod(start, end);
    if (validateDate && validatePeriod) {
      return new Period({ start, end });
    }
  }
}
