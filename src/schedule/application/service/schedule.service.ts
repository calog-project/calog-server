import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';

import { Schedule, SchedulePrimitives } from '../../domain/model/schedule';
import { ScheduleSummary } from '../../domain/model/schedule-summary';

import { CreateScheduleUseCase } from 'src/schedule/domain/port/in/create-schedule.usecase';
import { CreateScheduleCommand } from '../command/schedule.command';
import { GetScheduleUseCase } from '../../domain/port/in/get-schedule.usecase';
import {
  GetScheduleDetailQuery,
  GetManyScheduleQuery,
} from '../query/schedule.query';

import {
  HandleSchedulePortSymbol,
  HandleSchedulePort,
} from 'src/schedule/domain/port/out/handle-schedule.port';
import {
  LoadUserPortSymbol,
  LoadUserPort,
} from '../../../user/domain/port/out/load-user.port';
import {
  LoadSchedulePortSymbol,
  LoadSchedulePort,
} from '../../domain/port/out/load-schedule.port';

@Injectable()
export class ScheduleService
  implements CreateScheduleUseCase, GetScheduleUseCase
{
  constructor(
    @Inject(HandleSchedulePortSymbol)
    private readonly _handleSchedulePort: HandleSchedulePort,
    @Inject(LoadSchedulePortSymbol)
    private readonly _loadSchedulePort: LoadSchedulePort,
    @Inject(LoadUserPortSymbol)
    private readonly _loadUserPort: LoadUserPort,
    private readonly _eventBus: EventBus,
  ) {}

  async createSchedule(command: CreateScheduleCommand): Promise<any> {
    const isExists = await this._loadUserPort.findById(command.author);
    if (!isExists) throw new BadRequestException('존재하지 않은 작성자');

    const schedule = Schedule.create({ ...command });
    const scheduleId = await this._handleSchedulePort.save(schedule);

    schedule.events.forEach((event) => this._eventBus.publish(event));
    return scheduleId;
  }

  async getScheduleById(
    query: GetScheduleDetailQuery,
  ): Promise<SchedulePrimitives> {
    const schedule = this._loadSchedulePort.findById(query.id);
    if (!schedule) throw new NotFoundException('일정이 존재하지 않습니다.');
    return schedule;
  }
  async getScheduleByIds(
    query: GetManyScheduleQuery,
  ): Promise<SchedulePrimitives[] | ScheduleSummary[]> {
    const schedule = this._loadSchedulePort.findByIds(query.ids);
    if (!schedule) throw new NotFoundException('일정이 존재하지 않습니다.');
    return schedule;
  }
}
