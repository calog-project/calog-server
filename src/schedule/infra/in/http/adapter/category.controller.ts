import {
  Get,
  Post,
  Body,
  Param,
  Controller,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  GetCategoriesByUserIdQuery,
  GetCategoryQuery,
} from '../../../../application/query/category.query';
import { CreateCategoryDto } from '../dto/category.req';
import { CategoryResDto } from '../dto/category.res';
import { CategoryMapper } from '../mapper/category.mapper';
import { CategoryPrimitives } from '../../../../domain/model/category';

@Controller('category')
export class CategoryController {
  constructor(
    private readonly _commandBus: CommandBus,
    private readonly _queryBus: QueryBus,
  ) {}

  @Post('')
  @HttpCode(HttpStatus.CREATED)
  async createCategory(@Body() dto: CreateCategoryDto): Promise<void> {
    await this._commandBus.execute(CategoryMapper.toCommand(dto));
  }

  @Get('')
  async getCategoriesByUserId(
    @Param('userId') id: number,
  ): Promise<CategoryResDto[]> {
    const categories = await this._queryBus.execute<
      GetCategoriesByUserIdQuery,
      CategoryPrimitives[]
    >(new GetCategoriesByUserIdQuery(id));
    return CategoryMapper.toDto(categories);
  }

  @Get(':id')
  async getCategory(@Param('id') id: number): Promise<CategoryResDto> {
    const category = await this._queryBus.execute<
      GetCategoryQuery,
      CategoryResDto
    >(new GetCategoryQuery(id));
    return CategoryMapper.toDto(category);
  }
}
