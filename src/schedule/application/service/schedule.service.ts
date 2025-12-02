import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';

import { Schedule } from '../../domain/model/schedule';
import { ScheduleParticipant } from '../../domain/model/schedule-participant';

import {
  ScheduleFullReadModel,
  ScheduleReadModel,
  ParticipantRole,
  ParticipantStatus,
} from '../../domain/model/schedule-read-model';

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
import {
  HandleScheduleParticipantPortSymbol,
  HandleScheduleParticipantPort,
} from '../../domain/port/out/handle-schedule-participant.port';
import {
  LoadScheduleParticipantPortSymbol,
  LoadScheduleParticipantPort,
} from '../../domain/port/out/load-schedule-participant.port';
import {
  UnitOfWorkPortSymbol,
  UnitOfWorkPort,
} from '../../../common/port/uow.port';
import { ScheduleInvitedEvent } from '../../domain/schedule-invited.event';

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
    @Inject(HandleScheduleParticipantPortSymbol)
    private readonly _handleParticipantPort: HandleScheduleParticipantPort,
    @Inject(LoadScheduleParticipantPortSymbol)
    private readonly _loadParticipantPort: LoadScheduleParticipantPort,
    @Inject(LoadCategoryPortSymbol)
    private readonly _loadCategoryPort: LoadCategoryPort,
    @Inject(LoadUserPortSymbol)
    private readonly _loadUserPort: LoadUserPort,
    @Inject(UnitOfWorkPortSymbol)
    private readonly _unitOfWorkPort: UnitOfWorkPort,
    private readonly _eventBus: EventBus,
  ) {}

  async createSchedule(command: CreateScheduleCommand): Promise<number> {
    const { categoryId, joiner, ...scheduleProps } = command;

    const author = await this._loadUserPort.loadUserAggregateById(
      command.author,
    );
    if (!author) throw new BadRequestException('존재하지 않은 작성자');

    return await this._unitOfWorkPort.execute(async (bind) => {
      const scheduleAdapter = bind(this._handleSchedulePort);
      const participantAdapter = bind(this._handleParticipantPort);

      const schedule = Schedule.create({ ...scheduleProps });
      const scheduleId = await scheduleAdapter.save(schedule);

      if (joiner && joiner.length > 0) {
        const defaultCategory =
          await this._loadCategoryPort.findByUserIdAndCategoryName(-1, '공유');

        const participants: ScheduleParticipant[] = [
          ScheduleParticipant.create({
            scheduleId,
            userId: command.author,
            categoryId: categoryId,
            role: ParticipantRole.HOST,
            status: ParticipantStatus.ACCEPTED,
          }),
          ...joiner.map((userId) =>
            ScheduleParticipant.create({
              scheduleId,
              userId,
              categoryId: defaultCategory.id,
              role: ParticipantRole.GUEST,
              status: ParticipantStatus.INVITED,
            }),
          ),
        ];

        await participantAdapter.bulkSave(participants);

        this._eventBus.publish(
          new ScheduleInvitedEvent(
            scheduleId.toString(),
            command.author,
            command.title,
            joiner,
          ),
        );
      }
      return scheduleId;
    });
  }

  async getScheduleById(
    query: GetScheduleDetailQuery,
  ): Promise<ScheduleFullReadModel> {
    const schedule = await this._loadSchedulePort.findById(query.scheduleId);
    if (!schedule) throw new NotFoundException('일정이 존재하지 않습니다.');

    const participants = await this._loadParticipantPort.findByScheduleId(
      schedule.id,
    );

    return {
      schedule,
      participants,
    };
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

  async modifyParticipants(command: UpdateScheduleCommand): Promise<number> {
    console.log(command);
    return 1;
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
