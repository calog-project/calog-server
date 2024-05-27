import { User } from '../../user';
/**
 * @TODO
 * findOne port 일반화 리팩토링
 * findOne에서 값을 동적으로 받아서 하나의 메소드만 쓸지, email, nickname에 따라 메소드를 따로 만들지
 * 당신의 생각은 ?
 */
export interface LoadUserPort {
  findById(id: number): Promise<User | null>;

  findByEmail(email: string): Promise<User | null>;
  // findByEmailOrNickname(
  //   options: Partial<{ email: string; nickname: string }>,
  // ): Promise<User | null>;

  // findByNickname()
}
