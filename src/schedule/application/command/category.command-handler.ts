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
import {
  UpdateCategoryUseCaseSymbol,
  UpdateCategoryUseCase,
} from '../../domain/port/in/update-category.usecase';
import {
  DeleteCategoryUseCaseSymbol,
  DeleteCategoryUseCase,
} from '../../domain/port/in/delete-category.usecase';

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

@CommandHandler(UpdateCategoryCommand)
export class UpdateCategoryHandler
  implements ICommandHandler<UpdateCategoryCommand>
{
  constructor(
    @Inject(UpdateCategoryUseCaseSymbol)
    private readonly _updateCategoryUseCase: UpdateCategoryUseCase,
  ) {}
  async execute(command: UpdateCategoryCommand): Promise<number> {
    return await this._updateCategoryUseCase.updateCategory(command);
  }
}

@CommandHandler(DeleteCategoryCommand)
export class DeleteCategoryHandler
  implements ICommandHandler<DeleteCategoryCommand>
{
  constructor(
    @Inject(DeleteCategoryUseCaseSymbol)
    private readonly _deleteCategoryUseCase: DeleteCategoryUseCase,
  ) {}
  async execute(command: DeleteCategoryCommand): Promise<number> {
    return await this._deleteCategoryUseCase.deleteCategory(command);
  }
}
