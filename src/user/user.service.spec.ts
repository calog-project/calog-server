import { SignupDto } from './dto/user.input';
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import * as bcrypt from 'bcrypt';

// bcrypt mock
jest.mock('bcrypt', () => ({
  genSalt: jest.fn().mockResolvedValue('fake_salt'),
  hash: jest.fn().mockResolvedValue('hashed_password'),
}));

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  describe('createUser', () => {
    // it('이미 존재하는 유저인 경우 409 Conflict', async () => {})

    it('유저 생성 실패 500 Internal Server Error', async () => {
      const dto: SignupDto = {
        email: 'test@gmail.com',
        password: '12345678',
      };
      const result = await service.createUser(dto);
      expect(result).not.toEqual({
        email: 'test@gmail.com',
        password: 'notMatchingPassword',
      });
    });

    it('유저 생성 및 유저 반환 성공', async () => {
      const dto: SignupDto = {
        email: 'test@gmail.com',
        password: '12345678',
      };
      const result = await service.createUser(dto);
      expect(result).toEqual({
        email: 'test@gmail.com',
        password: 'hashed_password',
      });
    });
  });
});
