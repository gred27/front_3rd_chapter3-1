import { fetchHolidays } from '../../apis/fetchHolidays';

describe('fetchHolidays', () => {
  it('주어진 월의 공휴일만 반환한다', () => {
    const date = new Date('2024-01-01');
    expect(fetchHolidays(date)).toEqual({ '2024-01-01': '신정' });
  });

  it('공휴일이 없는 월에 대해 빈 객체를 반환한다', () => {
    const date = new Date('2024-11-01');
    expect(fetchHolidays(date)).toEqual({});
  });

  it('여러 공휴일이 있는 월에 대해 모든 공휴일을 반환한다', () => {
    const date = new Date('2024-10-01');
    expect(fetchHolidays(date)).toEqual({ '2024-10-03': '개천절', '2024-10-09': '한글날' });
  });
});
