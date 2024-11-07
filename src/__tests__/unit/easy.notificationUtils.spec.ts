import { Event } from '../../types';
import { createNotificationMessage, getUpcomingEvents } from '../../utils/notificationUtils';

describe('getUpcomingEvents', () => {
  const mockEvent = [
    {
      id: '1',
      title: '기존 회의',
      date: '2024-11-01',
      startTime: '09:00',
      endTime: '10:00',
      description: '기존 팀 미팅',
      location: '회의실 B',
      category: '업무',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 10,
    },
    {
      id: '2',
      title: '점심 약속',
      date: '2024-11-01',
      startTime: '12:00',
      endTime: '13:00',
      description: '팀 점심',
      location: '한식뷔페',
      category: '식사',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 15,
    },
    {
      id: '3',
      title: '프로젝트 마감',
      date: '2024-11-30',
      startTime: '18:00',
      endTime: '19:00',
      description: '프로젝트 마감',
      location: '사무실',
      category: '업무',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 60,
    },
    {
      id: '4',
      title: '모닝 커피',
      date: '2024-11-01',
      startTime: '09:10',
      endTime: '09:40',
      description: '커피 타임',
      location: '스타벅스',
      category: '업무',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 20,
    },
  ] as Event[];
  it('알림 시간이 정확히 도래한 이벤트를 반환한다', () => {
    const now = new Date('2024-11-01T08:50');

    const result = getUpcomingEvents(mockEvent, now, []);
    expect(result).toEqual([mockEvent[0]]);
  });

  it('이미 알림이 간 이벤트는 제외한다', () => {
    const now = new Date('2024-11-01T08:50');
    const notifiedEvents = ['1'];
    const result = getUpcomingEvents(mockEvent, now, notifiedEvents);
    expect(result).toEqual([mockEvent[3]]);
  });

  it('알림 시간이 아직 도래하지 않은 이벤트는 반환하지 않는다', () => {
    const now = new Date('2024-11-01T11:40');

    const result = getUpcomingEvents(mockEvent, now, []);
    expect(result).toEqual([]);
  });

  it('알림 시간이 지난 이벤트는 반환하지 않는다', () => {
    const now = new Date('2024-11-01T09:10');
    const result = getUpcomingEvents(mockEvent, now, []);
    expect(result).toEqual([]);
  });
});

describe('createNotificationMessage', () => {
  const mockEvent = [
    {
      id: '4',
      title: '모닝 커피',
      date: '2024-11-01',
      startTime: '09:10',
      endTime: '09:40',
      description: '커피 타임',
      location: '스타벅스',
      category: '업무',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 20,
    },
  ] as Event[];
  it('올바른 알림 메시지를 생성해야 한다', () => {
    expect(createNotificationMessage(mockEvent[0])).toBe('20분 후 모닝 커피 일정이 시작됩니다.');
  });
});
