import { Nullable } from 'src/common/type/CommonType';

export class CreateUserDto {
  email: Nullable<string>;

  password?: string;

  provider?: string;

  nickname?: Nullable<string>;
  desc?: Nullable<string>; // 소개글
  image?: Nullable<string>;
}
