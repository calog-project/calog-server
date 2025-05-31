import { Nullable } from 'src/common/type/CommonType';
import { IsInt, IsOptional, IsString } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CreateUserDto {
  email: Nullable<string>;

  password?: string;

  provider?: string;

  nickname?: Nullable<string>;
  description?: Nullable<string>; // 소개글
  image?: Nullable<string>;
}

export class UpdateUserDto {
  nickname?: Nullable<string>;
  description?: Nullable<string>; // 소개글
  image?: Nullable<string>;
}

export class SearchUsersReqDto {
  @IsString()
  @Transform(({ value }) => (!value || value == '' ? 'offset' : value))
  mode: 'offset' | 'cursor' = 'offset';

  @IsString()
  keyword: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Transform(({ value }) => {
    const num = value !== undefined ? Number(value) : 10;
    return isNaN(num) || num < 1 ? 10 : num;
  })
  limit: number = 10;

  @IsOptional()
  @Transform(({ value }) => {
    const num = value !== undefined ? Number(value) : 0;
    return isNaN(num) || num < 0 ? 0 : num;
  })
  @IsInt()
  offset?: number = 0;

  @IsOptional()
  @Transform(({ value }) => (!value || value === 'undefined' ? '' : value))
  @IsString()
  cursor?: string = '';
}
