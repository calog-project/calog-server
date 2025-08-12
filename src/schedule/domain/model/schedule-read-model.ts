export enum ParticipantStatus {
  INVITED = 'invited',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
}

export enum ParticipantRole {
  HOST = 'host',
  GUEST = 'guest',
}

export class ScheduleReadModel {
  aggregateId: string;
  id: number;
  author: number;
  title: string;
  start: Date;
  end: Date;
  categoryId?: number;
  joiner?: number[];
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

// @TODO
export class ScheduleSummary {}

// id: number;
// author: number;
// title: string;
// start: Date;
// end: Date;
// categoryId?: number;

export class ScheduleParticipantReadModel {
  scheduleId: number;
}
