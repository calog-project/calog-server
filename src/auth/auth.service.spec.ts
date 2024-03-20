import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    service = new AuthService();
  });

  it('should return success message if login is valid!', async () => {
    const result = await service.login({
      email: 'test',
      password: 'password123',
    });
    expect(result).toEqual({
      statusCode: 201,
      message: '로그인에 성공하였습니다!',
    });
  });

  it('should return error message if login is not valid', async () => {
    const result = await service.login({ email: 'test', password: 'wrong' });
    expect(result).toEqual({ statusCode: 401, message: '유효하지 않습니다!' });
  });
});
