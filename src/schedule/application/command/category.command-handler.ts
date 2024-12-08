import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  CreateCategoryCommand,
  UpdateCategoryCommand,
  DeleteCategoryCommand,
} from './category.command';
import {
  CreateCategoryUseCaseSymbol,
  CreateCategoryUseCase,
} from '../../domain/port/in/create-category.usecase';

@CommandHandler(CreateCategoryCommand)
export class CreateCategoryHandler
  implements ICommandHandler<CreateCategoryCommand>
{
  constructor(
    @Inject(CreateCategoryUseCaseSymbol)
    private readonly _createCategoryUseCase: CreateCategoryUseCase,
  ) {}
  async execute(command: CreateCategoryCommand): Promise<number> {
    return await this._createCategoryUseCase.createCategory(command);
  }
}
