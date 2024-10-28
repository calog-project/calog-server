import { UniqueID, UUIDv4 } from './unique-id';

const isEntity = (v: any): v is Entity<any> => {
  return v instanceof Entity;
};

/**
 * entity에 기본적으로 저장되는 id와 props에 저장되는 id
 * --> db상의 id와 도메인 이벤트 식별용 id가 다를 가능성
 */
export abstract class Entity<T> {
  readonly _id?: UUIDv4;
  readonly _dbId?: number;
  readonly props: T;
  constructor(props: T, id: UUIDv4, dbId?: number) {
    this._id = id ? id : new UniqueID();
    if (dbId) this._dbId = dbId;
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

    return this._id === object._id;

    // return this._id.equals(object._id);
  }
}
