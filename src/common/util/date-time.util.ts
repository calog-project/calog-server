export class DateTimeUtil {
  static toKst(date: Date): string {
    const kstOffset = 9 * 60 * 60 * 1000;
    const kst = new Date(date.getTime() + kstOffset);
    return kst.toISOString().replace('Z', '+09:00');
  }
}
