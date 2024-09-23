interface ValueObjectProps {
  [index: string]: any;
}

export abstract class ValueObject<T extends ValueObjectProps> {
  public readonly props: T;
  constructor(props: T) {
    this.props = props;
  }

  public equals(vo?: ValueObject<T>): boolean {
    if (vo === null || vo === undefined || vo.props === undefined) {
      return false;
    }
    return JSON.stringify(this.props) === JSON.stringify(vo.props);
  }

  // db에 이미 저장되었던 데이터는 유효성 검사X
  // static unsafeCreate(value: any) {
  //   return new ValueObject({ value });
  // }

  // protected getProp<K extends keyof T>(key: K): T[K] {
  //   return this.props[key];
  // }
}
