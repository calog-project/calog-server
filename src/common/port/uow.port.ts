export const UnitOfWorkPortSymbol = Symbol('UnitOfWorkPort');

export interface UnitOfWorkPort {
  execute<T>(work: (bind: <P>(port: P) => P) => Promise<T>): Promise<T>;
}
