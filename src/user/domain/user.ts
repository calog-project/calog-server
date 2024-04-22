import { Exclude } from 'class-transformer';
import { Nullable } from 'src/common/type/CommonType';

export class User {
  id: number | string;

  email: Nullable<string>;

  @Exclude({ toPlainOnly: true })
  password?: string;

  provider?: string;

  nickname?: string;
  description?: string;
  image?: string;

  createdAt: Date;
  updatedAt: Date;

  constructor() {}
}
