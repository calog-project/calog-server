import { Email } from 'src/user/domain/model/email';
import { Provider } from 'src/user/domain/model/provider';
import { Nickname } from 'src/user/domain/model/nickname';
import { Image } from 'src/user/domain/model/image';
import { User } from 'src/user/domain/model/user';
// import { User } from 'src/user/domain/user';

describe('UserDomain', () => {
  describe('EmailVO', () => {
    it('정상적인 이메일 입력 시 이메일 생성', () => {
      const email = 'test@test.com';
      expect(Email.create(email).props.email).toEqual(email);
    });
    it('이메일 형식이 아닌 값 입력 시 예외 처리', () => {
      const email = 'invalidEmail';
      expect(() => Email.create(email)).toThrow(
        '이메일 형식이 잘못되었습니다.',
      );
    });
    it('undefined 입력 시 예외 처리', () => {
      const email = undefined;
      expect(() => Email.create(email)).toThrow(
        '이메일 형식이 잘못되었습니다.',
      );
    });
  });

  describe('ProviderVO', () => {
    it('정상적인 프로바이더 입력 시 프로바이더 값 생성', () => {
      const provider = 'google';
      expect(Provider.create(provider).getValue()).toEqual(provider);
    });
    it('공백 입력 시 로컬 프로바이더 생성', () => {
      const provider = '';
      expect(Provider.create(provider).getValue()).toEqual('local');
    });
    it('비정상 프로바이더 입력 시 예외 처리', () => {
      const provider = 'invalidProvider';
      expect(() => Provider.create(provider)).toThrow(
        '프로바이더 형식이 잘못되었습니다.',
      );
    });
  });

  describe('NicknameVO', () => {
    it('정상적인 닉네임 입력 시 닉네임 생성', () => {
      const nickname = 'someNickname';
      expect(Nickname.create(nickname).props.nickname).toEqual(nickname);
    });
    it('공백 입력 시 예외 처리', () => {
      const nickname = '';
      expect(Nickname.create(nickname)).toBeFalsy;
    });
  });

  describe('ImageVO', () => {
    it('정상적인 이미지 url 입력 시 이미지 url 값 생성', () => {
      const imageUrl = 'https://www.dummy.com';
      expect(Image.create(imageUrl).getValue()).toEqual(imageUrl);
    });
    it('공백 입력 시 공백으로 이미지 url 값 생성', () => {
      expect(Image.create('').getValue()).toEqual('');
    });

    it('비정상 이미지 url 입력 시 예외 처리', () => {
      const imageUrl = 'invalidImageUrl';
      expect(() => Image.create(imageUrl)).toThrow(
        '이미지 url 형식이 잘못되었습니다.',
      );
    });
  });

  describe('User', () => {
    const validEmail: string = 'test@test.com';
    const invalidEmail: string = 'invalid-email';
    const validProvider: string = 'google';
    const invalidProvider: string = 'invalid-provider';
    const validNickname: string = '9_miin';
    const nullNickname: string = '';

    beforeAll(async () => {});

    it('이메일, 프로바이더 입력시 사용자 생성', () => {
      const user = User.create({ email: validEmail, provider: validProvider });
      expect(user).toBeDefined();
    });

    it('ID값이 없고 닉네임 공백 시 기본 닉네임 생성', () => {
      const user = User.create({ email: validEmail, provider: validProvider });
      expect(user.props.nickname.getValue()).toBeDefined();
    });

    it('이메일, 프로바이더, 닉네임, 입력시 사용자 생성', () => {
      const user = User.create({
        email: validEmail,
        provider: validProvider,
        nickname: validNickname,
      });
      expect(user).toBeDefined();
    });

    it('', () => {});
  });
});
