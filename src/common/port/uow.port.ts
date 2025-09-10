import { EntityManager } from 'typeorm';

export interface UnitOfWork {
  withTransaction<T>(work: (em: EntityManager) => Promise<T>): Promise<T>;
}
