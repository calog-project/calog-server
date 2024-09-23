import { ValueObject } from 'src/common/domain/value-object';
import { ProviderType } from 'src/common/dto/provider.enum';

export class Provider extends ValueObject<{ provider: ProviderType }> {
  constructor(value: { provider: ProviderType }) {
    super(value);
  }

  getValue(): string {
    return this.props.provider;
  }

  private static isLocalUser(value: string): boolean {
    return value === '' || value === undefined || value === ProviderType.LOCAL;
  }

  private static isValidProvider(value: string): boolean {
    return Object.values(ProviderType).includes(value as ProviderType);
  }

  static create(value: string): Provider {
    if (this.isLocalUser(value)) {
      return new Provider({ provider: ProviderType.LOCAL });
    } else if (this.isValidProvider(value)) {
      return new Provider({ provider: value as ProviderType });
    } else throw new Error('프로바이더 형식이 잘못되었습니다.');
  }
}
