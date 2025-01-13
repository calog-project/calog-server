import {
  Get,
  Query,
  Param,
  Controller,
  HttpCode,
  HttpStatus,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import {
  GetCalendarByPeriodQuery,
  GetInitialCalendarQuery,
} from '../../../../application/query/calendar.query';
import { JwtAccessAuthGuard } from '../../../../../common/guard/jwt-access-auth.guard';
import { UserId } from '../../../../../common/decorator/user-id.decorator';
import { ScheduleReadModel } from '../../../../domain/model/schedule-read-model';
import { CalendarSummaryResDto } from '../dto/calendar.res';
import { GetCalendarQueryReqDto } from '../dto/calendar.req';
import { ScheduleMapper } from '../mapper/schedule.mapper';
import { CategoryMapper } from '../mapper/category.mapper';
import { Calendar } from '../../../../domain/model/calendar';

@Controller('calendar')
export class CalendarController {
  constructor(private readonly _queryBus: QueryBus) {}

  @Get('init')
  @UseGuards(JwtAccessAuthGuard)
  async getCalendarSummary(
    @UserId() userId: number,
    @Query() query: GetCalendarQueryReqDto,
  ): Promise<CalendarSummaryResDto> {
    const calendar = await this._queryBus.execute<
      GetInitialCalendarQuery,
      Calendar
    >(new GetInitialCalendarQuery(userId, query.date));
    return {
      categories: CategoryMapper.toDto(calendar.categories),
      schedules: ScheduleMapper.toDto(calendar.schedules),
    };
  }

  @Get('init/:userId')
  async getCalendarSummaryTest(
    @Param('userId') userId: number,
    @Query() query: GetCalendarQueryReqDto,
  ): Promise<CalendarSummaryResDto> {
    const calendar: Calendar = await this._queryBus.execute(
      new GetInitialCalendarQuery(userId, query.date),
    );
    return {
      categories: CategoryMapper.toDto(calendar.categories),
      schedules: ScheduleMapper.toDto(calendar.schedules),
    };
  }

  @Get('')
  @UseGuards(JwtAccessAuthGuard)
  async getSchedulesForMonth(
    @UserId() userId: number,
    @Query('date') date: Date,
    @Query('categoryId') categoryId: number,
  ): Promise<ScheduleReadModel[]> {
    const schedules = await this._queryBus.execute(
      new GetCalendarByPeriodQuery(userId, date, categoryId),
    );
    return schedules;
  }

  @Get(':userId')
  async getSchedulesForMonthTest(
    @Param('userId') userId: number,
    @Query() query: GetCalendarQueryReqDto,
  ): Promise<ScheduleReadModel[]> {
    if (!userId)
      throw new BadRequestException(
        '경로 파라미터에 사용자 id 필드가 없습니다',
      );
    const schedules = await this._queryBus.execute(
      new GetCalendarByPeriodQuery(userId, query.date, query.categoryId),
    );
    return schedules;
  }
}
