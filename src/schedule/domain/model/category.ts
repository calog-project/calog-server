import { UniqueID } from '../../../common/domain/unique-id';
import { AggregateRoot } from '../../../common/domain/aggregate-root';

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
    return new Category({ ...props, aggregateId });
  }

  toPrimitives(): CategoryPrimitives {
    return {
      ...this.props,
      aggregateId: this.id.toString(),
    };
  }
}
