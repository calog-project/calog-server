import { UniqueID } from '../../../common/domain/unique-id';
import { AggregateRoot } from '../../../common/domain/aggregate-root';
import { DomainError } from '../../../common/domain/domain-error';

interface CategoryProps {
  aggregateId?: UniqueID;
  id?: number;
  userId: number;
  name: string;
  color: string;
}

export interface CategoryPrimitives {
  aggregateId?: string;
  id?: number;
  userId: number;
  name: string;
  color: string;
}

export class Category extends AggregateRoot<CategoryProps> {
  constructor(props: CategoryProps) {
    super(props, props.aggregateId, props.id);
  }
  static create(props: CategoryPrimitives): Category {
    const aggregateId = new UniqueID();
    if (!props.name || !props.color)
      throw new DomainError('잘못된 입력의 요청입니다');
    return new Category({ ...props, aggregateId });
  }

  hasChanges(name: string, color: string): boolean {
    return !(this.props.name === name && this.props.color === color);
  }

  changeName(name: string) {
    if (name) this.props.name = name;
    else throw new DomainError('잘못된 입력의 요청입니다');
  }

  changeColor(color: string) {
    if (color) this.props.color = color;
    else throw new DomainError('잘못된 입력의 요청입니다');
  }

  toPrimitives(): CategoryPrimitives {
    return {
      ...this.props,
      aggregateId: this.id.toString(),
    };
  }
}
