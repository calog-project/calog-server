import { AggregateRoot } from '../../../common/domain/aggregate-root';
import { UniqueID } from '../../../common/domain/unique-id';
import { DomainError } from '../../../common/domain/domain-error';
import { NotificationType } from './notification-type';

interface NotificationProps {
  aggregateId?: UniqueID;
  id?: number;
  type: NotificationType;
  receiverId: number;
  meta?: Record<string, any>;
  message: string;
  url?: string;
  isRead: boolean;
  actionable: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface NotificationPrimitives {
  aggregateId?: string;
  id?: number;
  type: NotificationType;
  receiverId: number;
  meta?: Record<string, any>; // 행동형 알림일 경우 추가 정보 저장 (예: scheduleId)
  message: string;
  url?: string;
  isRead: boolean;
  actionable: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Notification extends AggregateRoot<NotificationProps> {
  constructor(props: NotificationProps) {
    super(props, props.aggregateId, props.id);
  }

  static create(props: NotificationPrimitives): Notification {
    const aggregateId = new UniqueID();
    if (
      !props.receiverId ||
      props.message.length === 0 ||
      (props.actionable && !props.meta)
    ) {
      throw new DomainError('잘못된 입력의 요청입니다');
    }
    return new Notification({ ...props, aggregateId });
  }

  private created(type: string): void {
    if (type == NotificationType.ACTION) {
      // this.addEvent()
    } else {
      // this.addEvent()
    }
  }
}

/**
 * 실시간 알림
 * 알림 종류에 따라 다르게 분기
 * 소켓을 통해 알림 액션 발생 시 처리 --> 도메인 모델로
 * */
