export class CreateCategoryDto {
  userId: number;
  name: string;
  color: string;
}

export class UpdateCategoryDto {
  name: string;
  color: string;
}
