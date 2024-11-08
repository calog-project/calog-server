import {
  Get,
  Post,
  Body,
  Param,
  Controller,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateScheduleDto } from '../dto/schedule.req';
import { ScheduleDetailResDto } from '../dto/schedule.res';
import { ScheduleMapper } from '../mapper/schedule.mapper';

@Controller('schedule')
export class ScheduleController {
  constructor(
    private readonly _commandBus: CommandBus,
    private readonly _queryBus: QueryBus,
  ) {}

  @Post('')
  @HttpCode(HttpStatus.CREATED)
  async createSchedule(@Body() dto: CreateScheduleDto): Promise<void> {
    await this._commandBus.execute(ScheduleMapper.toCommand(dto));
  }

  @Get(':id')
  async getScheduleDetail(
    @Param('id') id: number,
  ): Promise<ScheduleDetailResDto> {
    const schedule = await this._queryBus.execute(ScheduleMapper.toQuery(id));
    return ScheduleMapper.toDto(schedule);
  }
}
