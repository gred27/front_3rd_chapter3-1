import { Event } from '../../types';
import { getFilteredEvents } from '../../utils/eventUtils';

describe('getFilteredEvents', () => {
  const mockEvents: Event[] = [
    {
      id: '1',
      title: '이벤트 1',
      date: '2024-07-01',
      startTime: '10:00',
      endTime: '11:00',
      description: '첫 번째 이벤트',
      location: '장소 A',
      category: '카테고리 1',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 0,
    },
    {
      id: '2',
      title: '이벤트 2',
      date: '2024-07-15',
      startTime: '14:00',
      endTime: '15:00',
      description: '두 번째 이벤트',
      location: '장소 B',
      category: '카테고리 2',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 0,
    },
    {
      id: '3',
      title: 'event3',
      date: '2024-07-20',
      startTime: '12:00',
      endTime: '13:00',
      description: '세 번째 이벤트',
      location: '장소 C',
      category: '카테고리 3',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 0,
    },
    {
      id: '4',
      title: '이벤트 4',
      date: '2024-07-01',
      startTime: '09:00',
      endTime: '10:00',
      description: '네 번째 이벤트',
      location: '장소 D',
      category: '카테고리 4',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 0,
    },
    {
      id: '5',
      title: 'EVENT 5',
      date: '2024-07-11',
      startTime: '09:00',
      endTime: '10:00',
      description: 'EVENT 5',
      location: '장소 D',
      category: '카테고리 5',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 0,
    },
  ] as Event[];

  it("검색어 '이벤트 2'에 맞는 이벤트만 반환한다", () => {
    expect(getFilteredEvents(mockEvents, '이벤트 2', new Date())).toEqual([mockEvents[1]]);
  });

  it('주간 뷰에서 2024-07-01 주의 이벤트만 반환한다', () => {
    const currentDate = new Date('2024-07-01');
    const result = getFilteredEvents(mockEvents, '', currentDate, 'week');
    expect(result).toEqual([mockEvents[0], mockEvents[3]]);
  });

  it('월간 뷰에서 2024년 7월의 모든 이벤트를 반환한다', () => {
    const currentDate = new Date('2024-07-01');
    const result = getFilteredEvents(mockEvents, '', currentDate, 'month');
    expect(result).toEqual(mockEvents);
  });

  it("검색어 '이벤트'와 주간 뷰 필터링을 동시에 적용한다", () => {
    const currentDate = new Date('2024-07-01');
    const result = getFilteredEvents(mockEvents, '이벤트', currentDate, 'week');
    expect(result).toEqual([mockEvents[0], mockEvents[3]]);
  });

  it('검색어가 없을 때 모든 이벤트를 반환한다', () => {
    const currentDate = new Date('2024-07-01');
    const result = getFilteredEvents(mockEvents, '', currentDate, 'month');
    expect(result).toEqual(mockEvents);
  });

  it('검색어가 대소문자를 구분하지 않고 작동한다', () => {
    const currentDate = new Date('2024-07-01');
    const result = getFilteredEvents(mockEvents, 'EVENT', currentDate, 'month');

    expect(result).toEqual([mockEvents[2], mockEvents[4]]);
  });

  it('월의 경계에 있는 이벤트를 올바르게 필터링한다', () => {
    const eventsWithBoundary: Event[] = [
      ...mockEvents,
      {
        id: '6',
        title: '월말 이벤트',
        date: '2024-07-31',
        startTime: '15:00',
        endTime: '16:00',
        description: '월말 미팅',
        location: '장소 E',
        category: '카테고리 6',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 0,
      },
    ];

    const currentDate = new Date('2024-07-31');
    const result = getFilteredEvents(eventsWithBoundary, '', currentDate, 'month');
    expect(result).toHaveLength(5);
    expect(result).toContainEqual(eventsWithBoundary[4]);
  });

  it('빈 이벤트 리스트에 대해 빈 배열을 반환한다', () => {
    const currentDate = new Date('2024-07-01');
    const result = getFilteredEvents([], '', currentDate, 'month');
    expect(result).toEqual([]);
  });
});
