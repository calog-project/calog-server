import { CategoryPrimitives } from '../../../../domain/model/category';
import { CategoryResDto } from '../dto/category.res';
import { CreateCategoryDto, UpdateCategoryDto } from '../dto/category.req';
import {
  CreateCategoryCommand,
  UpdateCategoryCommand,
  DeleteCategoryCommand,
} from '../../../../application/command/category.command';

export class CategoryMapper {
  static toCommand<T extends CreateCategoryDto | number>(
    idOrDto?: T,
    dto?: UpdateCategoryDto,
  ): CreateCategoryCommand | UpdateCategoryCommand | DeleteCategoryCommand {
    if (idOrDto && idOrDto instanceof CreateCategoryDto) {
      return new CreateCategoryCommand(
        idOrDto.userId,
        idOrDto.name,
        idOrDto.color,
      );
    } else if (dto && typeof idOrDto === 'number') {
      return new UpdateCategoryCommand(idOrDto, dto.name, dto.color);
    } else if (typeof idOrDto === 'number') {
      return new DeleteCategoryCommand(idOrDto);
    }
  }
  static toDto(view: CategoryPrimitives): CategoryResDto;
  static toDto(view: CategoryPrimitives[]): CategoryResDto[];
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
