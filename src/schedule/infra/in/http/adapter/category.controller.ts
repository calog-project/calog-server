import {
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Controller,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  GetCategoriesByUserIdQuery,
  GetCategoryQuery,
} from '../../../../application/query/category.query';
import { CreateCategoryDto, UpdateCategoryDto } from '../dto/category.req';
import { CategoryResDto } from '../dto/category.res';
import { CategoryMapper } from '../mapper/category.mapper';
import { CategoryPrimitives } from '../../../../domain/model/category';
import { UserId } from '../../../../../common/decorator/user-id.decorator';
import { JwtAccessAuthGuard } from '../../../../../common/guard/jwt-access-auth.guard';

@Controller('category')
export class CategoryController {
  constructor(
    private readonly _commandBus: CommandBus,
    private readonly _queryBus: QueryBus,
  ) {}

  @Post('')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAccessAuthGuard)
  async createCategory(@Body() dto: CreateCategoryDto): Promise<void> {
    await this._commandBus.execute(CategoryMapper.toCommand(dto));
  }

  @Get('')
  @UseGuards(JwtAccessAuthGuard)
  async getCategoriesByUserId(
    @UserId() userId: number,
  ): Promise<CategoryResDto[]> {
    const categories = await this._queryBus.execute<
      GetCategoriesByUserIdQuery,
      CategoryPrimitives[]
    >(new GetCategoriesByUserIdQuery(userId));
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

  @Patch(':id')
  async updateCategory(
    @Param('id') id: number,
    @Body() dto: UpdateCategoryDto,
  ): Promise<void> {
    const command = CategoryMapper.toCommand(id, dto);
    await this._commandBus.execute(command);
  }

  @Delete(':id')
  async deleteCategory(@Param('id') id: number): Promise<void> {
    await this._commandBus.execute(CategoryMapper.toCommand(id));
  }
}
