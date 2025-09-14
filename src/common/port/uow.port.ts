import { EntityManager } from 'typeorm';

export interface UnitOfWork {
  execute<T>(work: (em: EntityManager) => Promise<T>): Promise<T>;
}
