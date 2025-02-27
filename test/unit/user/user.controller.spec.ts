// import { Test, TestingModule } from '@nestjs/testing';
// import { CreateUserDto } from './application/dto/user.input';
// import { UserController } from './application/user.controller';
// import { UserService } from './application/service/user.service';

// describe('User Controller', () => {
//   let controller: UserController;
//   let service: UserService;

//   beforeEach(async () => {
//     const mockUserService = {
//       createUser: jest.fn().mockImplementation((dto: CreateUserDto) =>
//         Promise.resolve({
//           ...dto,
//           password: 'hashedPassword',
//         }),
//       ),
//     };
//     const module: TestingModule = await Test.createTestingModule({
//       controllers: [UserController],
//       providers: [
//         {
//           provide: UserService,
//           useValue: mockUserService,
//         },
//       ],
//     }).compile();
//     controller = module.get<UserController>(UserController);
//     service = module.get<UserService>(UserService);
//   });

//   it('회원가입 성공 시 회원 정보 반환', async () => {
//     const dto: CreateUserDto = {
//       email: 'test@gmail.com',
//       password: '12345678',
//     };
//     const result = await controller.signup(dto);
//     expect(result).toEqual(expect.any(Object));
//   });

//   it('회원 가입 실패', async () => {
//     const dto: CreateUserDto = {
//       email: 'test@gmail.com',
//       password: '12345678',
//     };
//     const result = await controller.signup(dto);
//     expect(result).not.toEqual({
//       email: 'test@gmail.com',
//       password: 'notMatchingPassword',
//     });
//   });
// });
