export class DateTimeUtil {
  static toKst(date: Date): string {
    const kstOffset = 9 * 60 * 60 * 1000;
    const kst = new Date(date.getTime() + kstOffset);
    return kst.toISOString().replace('Z', '+09:00');
  }

  static getMonthStartAndEnd(date: Date): { start: Date; end: Date } {
    const start = Date.UTC(date.getFullYear(), date.getMonth(), 1);
    const end = Date.UTC(
      date.getFullYear(),
      date.getMonth() + 1,
      0,
      23,
      59,
      59,
      999,
    );
    return { start: new Date(start), end: new Date(end) };
  }

  static getDayStartAndEnd(date: Date): { start: Date; end: Date } {
    const start = Date.UTC(date.getFullYear(), date.getMonth(), 1);
    const end = Date.UTC(date.getFullYear(), date.getMonth(), 1);
    return { start: new Date(start), end: new Date(end) };
  }
}
