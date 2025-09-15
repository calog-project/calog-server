import { EntityManager } from 'typeorm';

export interface UnitOfWorkPort {
  execute<T>(work: (em: EntityManager) => Promise<T>): Promise<T>;
}
