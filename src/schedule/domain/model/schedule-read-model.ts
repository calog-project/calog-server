export enum ParticipantStatus {
  INVITED = 'invited',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
}

export enum ParticipantRole {
  HOST = 'host',
  GUEST = 'guest',
}

//participant read model
export class ScheduleParticipantReadModel {
  categoryId: number;
  userId: number;
  nickname: string;
  role: ParticipantRole;
  status: ParticipantStatus;
  createdAt: Date;
  updatedAt: Date;
}

export class ScheduleReadModel {
  aggregateId: string;
  id: number;
  author: number;
  title: string;
  start: Date;
  end: Date;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class ScheduleFullReadModel {
  schedule: ScheduleReadModel;
  participants: ScheduleParticipantReadModel[];
}

/**
 * @TODO
 * 1. 캘린더 상의 일정 모델
 * 2. 일정 상세의 일정 모델
 * */

export class ScheduleSummaryReadModel {
  id: number;
  aggregateId: string;

  title: string;
  start: Date;
  end: Date;

  categoryId: number;
}
// aggregateId: string;
// id: number;
// author: number;
// title: string;
// start: Date;
// end: Date;
// categoryId?: number;
// description?: string;
// 단체 일정 여부 값 표시
