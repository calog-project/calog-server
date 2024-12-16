import {
  Category,
  CategoryPrimitives,
} from '../../../../domain/model/category';
import { CategoryEntity } from '../entity/category.entity';

export class CategoryMapper {
  public static toReadModel(raw: CategoryEntity): CategoryPrimitives {
    return {
      ...raw,
    };
  }
  public static toReadModels(raws: CategoryEntity[]): CategoryPrimitives[] {
    return raws.map((raw) => {
      return { ...raw };
    });
  }

  public static toOrmEntity(domain: Partial<Category>): CategoryEntity {
    const data = domain.toPrimitives();
    const parseId = typeof data.id === 'number' ? data.id : parseInt(data.id);
    const record = new CategoryEntity();
    Object.assign(record, data);
    if (parseId) data.id = parseId;
    return record;
  }
}
