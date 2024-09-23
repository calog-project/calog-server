import {
  Inject,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Nullable } from 'src/common/type/CommonType';

import { User } from 'src/user/domain/model/user';

//Input port
import { CreateUserUseCase } from '../../domain/port/in/create-user.usecase';
import { GetUserUseCase } from '../../domain/port/in/get-user.usecase';

//Output port
import {
  HandleUserPortSymbol,
  HandleUserPort,
} from 'src/user/domain/port/out/handle-user.port';
import {
  LoadUserPortSymbol,
  LoadUserPort,
} from 'src/user/domain/port/out/load-user.port';
import {
  EncryptPortSymbol,
  EncryptPort,
} from 'src/auth/domain/port/out/encrypt.port';
import { FilePortSymbol, FilePort } from 'src/user/domain/port/out/file.port';

@Injectable()
export class UserService implements CreateUserUseCase, GetUserUseCase {
  constructor(
    @Inject(EncryptPortSymbol)
    private _encryptPort: EncryptPort,
    @Inject(FilePortSymbol)
    private _filePort: FilePort,
    @Inject(HandleUserPortSymbol)
    private _handleUserPort: HandleUserPort,
    @Inject(LoadUserPortSymbol)
    private _loadUserPort: LoadUserPort,
  ) {}

  async createUser(
    user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<number | string> {
    const isExists = await this._loadUserPort.findByEmail(
      user.props.email.getValue(),
    );
    if (isExists) throw new BadRequestException('이미 사용중인 이메일입니다.');

    user.changePassword(
      await this._encryptPort.encryptPassword(user.props.password),
    );
    // user.initImage(await this._filePort)
    const result = await this._handleUserPort.save(user);
    return result;
  }

  async getUserById(id: number): Promise<Nullable<User>> {
    const user = await this._loadUserPort.findById(id);
    if (!user) throw new NotFoundException('존재하지 않은 사용자입니다.');
    return user;
  }

  async getUserByEmail(email: string): Promise<Nullable<User>> {
    const user = await this._loadUserPort.findByEmail(email);
    if (!user) throw new NotFoundException('존재하지 않은 사용자입니다.');
    return user;
  }

  async isExistsEmail(email: string): Promise<boolean> {
    const user = await this._loadUserPort.findByEmail(email);
    return !!user;
  }
}
