// export interface BaseMapper<T, U> {
//   toDomain(raw: U): T;
//   toOrmEntity(user: T | Partial<T>): U;
// }

export abstract class Mapper<Domain, Record> {
  abstract toDomain(record: Record): Domain;
  abstract toPersistence(domain: Domain): Record;
}
