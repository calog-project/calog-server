import {
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Controller,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { UserId } from '../../../../../common/decorator/user-id.decorator';
import { JwtAccessAuthGuard } from '../../../../../common/guard/jwt-access-auth.guard';
import { GetScheduleDetailQuery } from '../../../../application/query/schedule.query';
import { CreateScheduleDto, UpdateScheduleDto } from '../dto/schedule.req';
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
  @UseGuards(JwtAccessAuthGuard)
  async createSchedule(@Body() dto: CreateScheduleDto): Promise<void> {
    await this._commandBus.execute(
      ScheduleMapper.toCommand<CreateScheduleDto>(null, dto),
    );
  }

  @Get(':id')
  // @UseGuards(JwtAccessAuthGuard)
  async getScheduleDetail(
    @UserId('userId') userId: number,
    @Param('id') scheduleId: number,
  ): Promise<ScheduleDetailResDto> {
    const schedule = await this._queryBus.execute(
      new GetScheduleDetailQuery(userId, scheduleId),
    );
    return ScheduleMapper.toDto(schedule);
  }

  @Patch(':id')
  async changeSchedule(
    @Param('id') id: number,
    @Body() dto: UpdateScheduleDto,
  ): Promise<void> {
    await this._commandBus.execute(
      ScheduleMapper.toCommand<UpdateScheduleDto>(id, dto),
    );
  }

  @Delete(':id')
  @UseGuards(JwtAccessAuthGuard)
  async deleteSchedule(@Param('id') id: number) {
    await this._commandBus.execute(ScheduleMapper.toCommand(id, null));
  }
}
