import { Identifier } from './identifier';
import { randomUUID } from 'crypto';

export const genUUIDv4 = () => {
  return randomUUID();
};

export class UniqueID extends Identifier<string | number> {
  constructor(id?: string | number) {
    super(id ? id : genUUIDv4());
  }
}

export class UUIDv4 extends Identifier<string | number> {
  constructor(id?: string | number) {
    super(id ? id : genUUIDv4());
  }
}
