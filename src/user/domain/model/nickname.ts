import { ValueObject } from 'src/common/domain/value-object';

interface NicknameProps {
  nickname: string;
}
export class Nickname extends ValueObject<NicknameProps> {
  private constructor(props: NicknameProps) {
    super(props);
  }

  getValue(): string {
    return this.props.nickname;
  }

  static create(nickname: string): Nickname {
    return new Nickname({ nickname });
  }
}
