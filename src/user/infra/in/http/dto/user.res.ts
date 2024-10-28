export class ShowUserResDto {
  id: number;
  email: string;
  provider: string;

  image: string;
  nickname: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(input: ShowUserResDto) {
    this.id = input.id;
    this.email = input.email;
    this.provider = input.provider;

    this.image = input.image;
    this.nickname = input.nickname;
    this.description = input.description;
    this.createdAt = input.createdAt;
    this.updatedAt = input.updatedAt;
  }

  // static of() {
  //   //...
  // }
}
