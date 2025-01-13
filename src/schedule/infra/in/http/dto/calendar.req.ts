import { Transform } from 'class-transformer';
import { IsNotEmpty, IsDate, IsOptional } from 'class-validator';

export class GetCalendarQueryReqDto {
  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  date: Date;

  @IsOptional()
  categoryId: number;
}
