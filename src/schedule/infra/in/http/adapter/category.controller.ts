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

@Controller('category')
export class CategoryController {
  constructor(
    private readonly _commandBus: CommandBus,
    private readonly _queryBus: QueryBus,
  ) {}

  @Post('')
  @HttpCode(HttpStatus.CREATED)
  async createCategory(@Body() dto: any): Promise<void> {
    // await this._commandBus.execute();
  }

  // @Get(':id')
  // async getCategory(@Param('id') id: number): Promise<any> {
  //   const category;
  // }
}
