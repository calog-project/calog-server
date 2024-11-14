import { ValueObject } from './value-object';

export class DateTimeVO<T> extends ValueObject<T> {
  // private readonly _timezone: string = 'UTC';

  constructor(props: T) {
    super(props);
    // if (props.timezone) this._timezone = props.timezone;
  }

  // get timezone(): string {
  //   return this._timezone;
  // }

  protected static isValidDate(value: Date): boolean {
    if (!(value instanceof Date) || isNaN(value.getDate())) {
      throw new Error('입력값이 잘못되었습니다');
    } else if (!value.toISOString().endsWith('Z')) {
      throw new Error('형식이 잘못되었습니다');
    }
    return true;
  }

  toUtc(date: Date): Date {
    // return this._timezone === 'KST'
    //   ? new Date(date.getTime() - 9 * 60 * 60 * 1000)
    //   : date;
    return new Date(date.getTime() - 9 * 60 * 60 * 1000);
  }

  toKst(date: Date): Date {
    // return this._timezone === 'UTC'
    //   ? new Date(date.getTime() + 9 * 60 * 60 * 1000)
    //   : date;
    return new Date(date.getTime() + 9 * 60 * 60 * 1000);
  }
}
