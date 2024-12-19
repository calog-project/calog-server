import { Period } from '../../../src/schedule/domain/model/period';
import { Schedule } from '../../../src/schedule/domain/model/schedule';

describe('ScheduleDomain', () => {
  describe('Period', () => {
    it('date 객체 입력 시 기간 VO 생성', () => {
      const period = Period.create(new Date(), new Date());
      expect(period).toBeDefined();
    });
    it('data 객체 외 다른 값 입력 시 예외 처리', () => {});
  });

  describe('Schedule', () => {
    const aggregateId = 'uuid';
    const id = 1;
    const author = 1;
    const title = 'title';
    const start = new Date();
    const end = new Date(new Date().getTime() + 48 * 24 * 24 * 1000);
    const joiner = [1, 2, 3];
    const description = 'description';

    it('필수 값(작성자, 제목, 시작 및 종료 시간) 입력 시 일정 모델 생성', () => {
      const schedule = Schedule.create({ author, title, start, end });
      expect(schedule).toBeDefined();
    });
    it('모든 속성 입력 시 일정 모델 생성', () => {
      const schedule = Schedule.create({
        aggregateId,
        id,
        author,
        title,
        start,
        end,
        joiner,
        description,
      });
      expect(schedule).toBeDefined();
    });
  });
});
