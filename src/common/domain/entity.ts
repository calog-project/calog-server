const isEntity = (v: any): v is Entity<any> => {
  return v instanceof Entity;
};

/**
 * entity에 기본적으로 저장되는 id와 props에 저장되는 id
 * --> db상의 id와 도메인 이벤트 식별용 id가 다를 가능성
 */
export abstract class Entity<T> {
  readonly _id?: string | number;
  readonly props: T;
  constructor(props: T, id: string | number) {
    if (id) this._id = id;
    this.props = props;
  }
  public equals(object?: Entity<T>): boolean {
    if (object == null || object == undefined) {
      return false;
    }

    if (this === object) {
      return true;
    }

    if (!isEntity(object)) {
      return false;
    }

    return this._id === object._id ? true : false;

    // return this._id.equals(object._id);
  }
}
