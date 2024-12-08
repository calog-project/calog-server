import { CategoryPrimitives } from '../../../../domain/model/category';
import { CategoryResDto } from '../dto/category.res';
import { CreateCategoryDto } from '../dto/category.req';
import { CreateCategoryCommand } from '../../../../application/command/category.command';

export class CategoryMapper {
  static toCommand(dto: CreateCategoryDto): CreateCategoryCommand;
  static toCommand(dto: CreateCategoryDto): CreateCategoryCommand {
    if (dto && dto instanceof CreateCategoryDto) {
      return new CreateCategoryCommand(dto.userId, dto.name, dto.color);
    }
  }

  static toQuery() {}

  static toDto(
    view: CategoryPrimitives | CategoryPrimitives[],
  ): CategoryResDto | CategoryResDto[] {
    if (Array.isArray(view)) {
      return view.map((category) => {
        return new CategoryResDto(
          category.aggregateId,
          category.id,
          category.userId,
          category.name,
          category.color,
        );
      });
    } else {
      return new CategoryResDto(
        view.aggregateId,
        view.id,
        view.userId,
        view.name,
        view.color,
      );
    }
  }
}
