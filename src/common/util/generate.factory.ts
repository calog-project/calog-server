export class Generate {
  static genNickname(email: string): string {
    const identifier = email.split('@')[0] || String(Math.random() * 1000);
    const random = String(Math.random()).split('.')[1];
    return `${identifier}_${random.slice(1, 9)}`;
  }
}
