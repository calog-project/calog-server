import { Entity } from 'src/common/domain/entity';
import { Email } from './email';
import { Provider } from './provider';
import { Nickname } from './nickname';

interface UserProps {
  id?: string | number;
  email: Email;
  password?: string;
  provider?: Provider;
  nickname?: Nickname;
  image?: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
interface UserPrimitives {
  id?: string | number;
  email: string;
  password?: string;
  provider?: string;
  nickname?: string;
  image?: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class User extends Entity<UserProps> {
  private constructor(props: UserProps) {
    super(props, props.id);
  }
  public static create(props: UserPrimitives): User {
    if (!props.id && !props.nickname) {
      props.nickname = this.defaultNickname(props.email);
    }
    return new User({
      ...props,
      email: Email.create(props.email),
      provider: Provider.create(props.provider),
      nickname: Nickname.create(props.nickname),
    });
  }

  // public static createFromVO(props: UserProps) {}

  private static defaultNickname(email: string): string {
    const identifier = email.split('@')[0] || String(Math.random() * 1000);
    const random = String(Math.random()).split('.')[1];
    return `${identifier}_${random.slice(1, 9)}`;
  }

  changePassword(hashedPassword: string): void {
    this.props.password = hashedPassword;
  }
  initImage(url: string): void {
    if (url) this.props.image = url;
    else this.props.image = '';
  }

  changeImage(image?: string): void {
    if (image) this.props.image = image;
    else this.props.image = '';
  }
  updateNickName(nickname: string): void {
    if (nickname) this.props.nickname = Nickname.create(nickname);
    // else this.props.nickname = '';
  }
  updateDescription(des?: string): void {
    if (des) this.props.description = des;
    else this.props.description = '';
  }

  toPrimitives(): UserPrimitives {
    return {
      ...this.props,
      email: this.props.email.getValue(),
      provider: this.props.provider.getValue(),
      nickname: this.props.nickname.getValue(),
    };
  }
}
