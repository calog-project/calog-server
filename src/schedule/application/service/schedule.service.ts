import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';

import { Schedule, SchedulePrimitives } from '../../domain/model/schedule';
import { ScheduleReadModel } from '../../domain/model/schedule-read-model';

import { CreateScheduleUseCase } from 'src/schedule/domain/port/in/create-schedule.usecase';
import { UpdateScheduleUseCase } from '../../domain/port/in/update-schedule.usecase';
import { DeleteScheduleUseCase } from '../../domain/port/in/delete-schedule.usecase';
import {
  CreateScheduleCommand,
  DeleteScheduleCommand,
  UpdateScheduleCommand,
} from '../command/schedule.command';
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
import {
  LoadCategoryPortSymbol,
  LoadCategoryPort,
} from '../../domain/port/out/load-category.port';

@Injectable()
export class ScheduleService
  implements
    CreateScheduleUseCase,
    GetScheduleUseCase,
    UpdateScheduleUseCase,
    DeleteScheduleUseCase
{
  constructor(
    @Inject(HandleSchedulePortSymbol)
    private readonly _handleSchedulePort: HandleSchedulePort,
    @Inject(LoadSchedulePortSymbol)
    private readonly _loadSchedulePort: LoadSchedulePort,
    @Inject(LoadCategoryPortSymbol)
    private readonly _loadCategoryPort: LoadCategoryPort,
    @Inject(LoadUserPortSymbol)
    private readonly _loadUserPort: LoadUserPort,
    private readonly _eventBus: EventBus,
  ) {}

  async createSchedule(command: CreateScheduleCommand): Promise<any> {
    const { categoryId, ...scheduleProps } = command;
    const isExists = await this._loadUserPort.findById(scheduleProps.author);
    if (!isExists) throw new BadRequestException('존재하지 않은 작성자');

    let defaultCategoryId: number | undefined;

    if (scheduleProps.joiner && scheduleProps.joiner.length > 0) {
      const defaultCategory =
        await this._loadCategoryPort.findByUserIdAndCategoryName(-1, '공유');
      defaultCategoryId = defaultCategory.id;
    }

    const schedule = Schedule.create({ ...scheduleProps });
    const scheduleId = await this._handleSchedulePort.save(
      schedule,
      categoryId,
      defaultCategoryId,
    );

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
  ): Promise<ScheduleReadModel[]> {
    const schedule = this._loadSchedulePort.findByIds(query.ids);
    if (!schedule) throw new NotFoundException('일정이 존재하지 않습니다.');
    return schedule;
  }

  async updateSchedule(command: UpdateScheduleCommand): Promise<number> {
    const schedule = await this._loadSchedulePort.findById(command.id);
    if (!schedule) throw new BadRequestException('존재하지 않은 일정입니다');
    if (command.categoryId) {
      const existsCategory = this._loadCategoryPort.findById(
        command.categoryId,
      );
      if (!existsCategory)
        throw new BadRequestException('존재하지 않은 카테고리입니다');
    }
    const updateSchedule = Schedule.create({ ...schedule });
    updateSchedule.changeTitle(command.title);
    updateSchedule.changePeriod(command.start, command.end);
    updateSchedule.changeDescription(command.description);

    return await this._handleSchedulePort.update(
      updateSchedule,
      command.userId,
      command.categoryId,
    );
  }

  async deleteSchedule(command: DeleteScheduleCommand): Promise<number> {
    const schedule = await this._loadSchedulePort.findById(command.id);
    if (!schedule) {
      throw new BadRequestException('존재하지 않는 일정입니다');
    }
    return await this._handleSchedulePort.delete(command.id);
  }
  //invite , reject, approve
}
