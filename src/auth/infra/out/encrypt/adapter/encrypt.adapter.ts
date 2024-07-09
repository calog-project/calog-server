import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { EncryptPort } from 'src/auth/domain/port/out/encrypt.port';

@Injectable()
export class EncryptAdapter implements EncryptPort {
  async encryptPassword(plain: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(plain, salt);
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }
}
