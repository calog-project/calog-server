export class DateTimeUtil {
  static toKst(date: Date): string {
    const kstOffset = 9 * 60 * 60 * 1000;
    const kst = new Date(date.getTime() + kstOffset);
    return kst.toISOString().replace('Z', '+09:00');
  }

  // static toTimezone(date: Date, offsetInHours: number): string {}
  // 검색하는 조건을 만들 때 클라이언트 타임존 -> UTC로 조건을 변경한 후에 쿼리해야함.
  // timezone 필요
  // 특정 타임존 -> UTC 변경 시점은 월의 시작, 끝을 계산한 후 각각 적용 해야 함 (그 전의 date값은 몇 월인지 식별하기 위함)
  static getMonthStartAndEndForKST(date: Date): { start: Date; end: Date } {
    const start = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1, 0 - 9);
    const end = Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth() + 1,
      0,
      23 - 9,
      59,
      59,
      999,
    );
    return { start: new Date(start), end: new Date(end) };

    // // 월의 시작과 끝 계산 (UTC 기준)
    // const startUtc = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1, 0, 0, 0, 0));
    // const endUtc = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0, 23, 59, 59, 999));
    //
    // // 타임존 오프셋 적용
    // const startWithOffset = new Date(startUtc.getTime() + offsetInHours * 60 * 60 * 1000);
    // const endWithOffset = new Date(endUtc.getTime() + offsetInHours * 60 * 60 * 1000);
    //
    // return { start: startWithOffset, end: endWithOffset };
  }

  static getDayStartAndEnd(date: Date): { start: Date; end: Date } {
    const start = Date.UTC(date.getFullYear(), date.getMonth(), 1);
    const end = Date.UTC(date.getFullYear(), date.getMonth(), 1);
    return { start: new Date(start), end: new Date(end) };
  }
}
