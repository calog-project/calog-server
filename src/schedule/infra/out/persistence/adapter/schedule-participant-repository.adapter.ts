import { HandleScheduleParticipantPort } from '../../../../domain/port/out/handle-schedule-participant.port';
import { InjectRepository } from '@nestjs/typeorm';
import { ScheduleParticipantEntity } from '../entity/schedule-participant.entity';
import { Repository } from 'typeorm';

export class ScheduleParticipantRepositoryAdapter
  implements HandleScheduleParticipantPort
{
  constructor(
    @InjectRepository(ScheduleParticipantEntity)
    private readonly _participantRepository: Repository<ScheduleParticipantEntity>,
  ) {}

  async bulkSave(): Promise<void> {}
  async save(): Promise<void> {}
}
