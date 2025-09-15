import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { UnitOfWorkPort } from '../port/uow.port';

@Injectable()
export class TypeormUowAdapter implements UnitOfWorkPort {
  constructor(private readonly dataSource: DataSource) {}

  async execute<T>(work: (em: EntityManager) => Promise<T>): Promise<T> {
    return this.dataSource.transaction(async (em) => {
      return work(em);
    });
  }
}
