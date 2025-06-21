// src/common/dto/pagination-request.dto.ts
import { IsInt, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationRequestDto<C = any> {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  limit?: number = 10;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  offset?: number = 0;

  // 커서 방식
  @IsOptional()
  cursor?: C = null;
}
