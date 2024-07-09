export const EncryptPortSymbol = Symbol('EncryptPort');

export interface EncryptPort {
  encryptPassword(plain: string): Promise<string>;
  comparePassword(password: string, hash: string): Promise<boolean>;
}
