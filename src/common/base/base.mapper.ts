export interface BaseMapper<T, U> {
  toDomain(raw: U): T;
  toOrmEntity(user: T | Partial<T>): U;
}
