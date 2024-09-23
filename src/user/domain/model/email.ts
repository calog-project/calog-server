import { ValueObject } from 'src/common/domain/value-object';

interface EmailProps {
  email: string;
}
export class Email extends ValueObject<EmailProps> {
  private readonly _value: string;
  private constructor(props: EmailProps) {
    super(props);
    this._value = props.email;
  }

  public getValue() {
    return this._value;
  }

  private static isValidEmail(value: string): boolean {
    const regex = new RegExp(
      '^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)*$',
    );
    return regex.test(value);
  }

  static create(email: string): Email {
    if (this.isValidEmail(email)) return new Email({ email });
    else throw new Error('이메일 형식이 잘못되었습니다.');
  }
}
