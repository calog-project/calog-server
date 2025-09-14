import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { UnitOfWork } from '../port/uow.port';

@Injectable()
export class TypeormUowAdapter implements UnitOfWork {
  constructor(private readonly dataSource: DataSource) {}

  execute<T>(work: (em: EntityManager) => Promise<T>): Promise<T> {
    return this.dataSource.transaction(async (em) => {
      return work(em);
    });
  }
}
