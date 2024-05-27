import { Nullable } from 'src/common/type/CommonType';

export class CreateUserDto {
  email: Nullable<string>;

  password?: string;

  provider?: string;

  nickname?: Nullable<string>;
  description?: Nullable<string>; // 소개글
  image?: Nullable<string>;
}

export class UpdateUserDto {
  id: number;

  email?: Nullable<string>;

  password?: string;

  provider?: string;

  nickname?: Nullable<string>;
  description?: Nullable<string>; // 소개글
  image?: Nullable<string>;
}
