import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { UnitOfWorkPort } from '../port/uow.port';

@Injectable()
export class TypeormUowAdapter implements UnitOfWorkPort {
  constructor(private readonly dataSource: DataSource) {}

  private static hasWithManager<P>(
    p: P,
  ): p is P & { withManager: (em: EntityManager) => P } {
    return typeof (p as any)?.withManager === 'function';
  }

  async execute<T>(work: (bind: <P>(port: P) => P) => Promise<T>): Promise<T> {
    return this.dataSource.transaction(async (em) => {
      const bind = <P>(port: P): P =>
        TypeormUowAdapter.hasWithManager(port) ? port.withManager(em) : port;

      return work(bind);
    });
  }
}
