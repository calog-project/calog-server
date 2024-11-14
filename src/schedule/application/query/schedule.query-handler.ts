import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetScheduleDetailQuery } from './schedule.query';
import { SchedulePrimitives } from '../../domain/model/schedule';
import {
  GetScheduleUseCaseSymbol,
  GetScheduleUseCase,
} from '../../domain/port/in/get-schedule.usecase';

@QueryHandler(GetScheduleDetailQuery)
export class GetScheduleDetailHandler
  implements IQueryHandler<GetScheduleDetailQuery>
{
  constructor(
    @Inject(GetScheduleUseCaseSymbol)
    private readonly _getScheduleUseCase: GetScheduleUseCase,
  ) {}
  async execute(query: GetScheduleDetailQuery): Promise<SchedulePrimitives> {
    return await this._getScheduleUseCase.getScheduleById(query);
  }
}
