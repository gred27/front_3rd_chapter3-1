import { Event } from '../../types';
import {
  convertEventToDateRange,
  findOverlappingEvents,
  isOverlapping,
  parseDateTime,
} from '../../utils/eventOverlap';

describe('parseDateTime', () => {
  it('2024-07-01 14:30을 정확한 Date 객체로 변환한다', () => {
    const expectedDate = new Date('2024-07-01T14:30');
    expect(parseDateTime('2024-07-01', '14:30')).toEqual(expectedDate);
  });

  it('잘못된 날짜 형식에 대해 Invalid Date를 반환한다', () => {
    expect(parseDateTime('2024-13-32', '14:30').toString()).toBe('Invalid Date');
  });

  it('잘못된 시간 형식에 대해 Invalid Date를 반환한다', () => {
    expect(parseDateTime('2024-12-31', '25:30').toString()).toBe('Invalid Date');
  });

  it('날짜 문자열이 비어있을 때 Invalid Date를 반환한다', () => {
    expect(parseDateTime('', '14:30').toString()).toBe('Invalid Date');
  });
});

describe('convertEventToDateRange', () => {
  it('일반적인 이벤트를 올바른 시작 및 종료 시간을 가진 객체로 변환한다', () => {
    const mockEvent = {
      id: '1',
      title: '기존 회의',
      date: '2024-10-15',
      startTime: '09:00',
      endTime: '10:00',
      description: '기존 팀 미팅',
      location: '회의실 B',
      category: '업무',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 10,
    } as Event;

    const expected = {
      start: new Date('2024-10-15T09:00'),
      end: new Date('2024-10-15T10:00'),
    };
    expect(convertEventToDateRange(mockEvent)).toEqual(expected);
  });

  it('잘못된 날짜 형식의 이벤트에 대해 Invalid Date를 반환한다', () => {
    const mockEvent = {
      id: '1',
      title: '기존 회의',
      date: '2024-13-80',
      startTime: '09:00',
      endTime: '10:00',
      description: '기존 팀 미팅',
      location: '회의실 B',
      category: '업무',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 10,
    } as Event;

    const expected = {
      start: new Date('2024-13-80T09:00'),
      end: new Date('2024-13-80T10:00'),
    };
    expect(convertEventToDateRange(mockEvent)).toEqual(expected);
  });

  it('잘못된 시간 형식의 이벤트에 대해 Invalid Date를 반환한다', () => {
    const mockEvent = {
      id: '1',
      title: '기존 회의',
      date: '2024-11-20',
      startTime: '80:00',
      endTime: '90:00',
      description: '기존 팀 미팅',
      location: '회의실 B',
      category: '업무',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 10,
    } as Event;

    const expected = {
      start: new Date('2024-11-20T80:00'),
      end: new Date('2024-11-20T90:00'),
    };
    expect(convertEventToDateRange(mockEvent)).toEqual(expected);
  });
});

describe('isOverlapping', () => {
  const mockEvent = [
    {
      id: '1',
      title: '기존 회의',
      date: '2024-11-01',
      startTime: '09:00',
      endTime: '12:30',
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
  ] as Event[];
  it('두 이벤트가 겹치는 경우 true를 반환한다', () => {
    expect(isOverlapping(mockEvent[0], mockEvent[1])).toBeTruthy();
  });

  it('두 이벤트가 겹치지 않는 경우 false를 반환한다', () => {
    expect(isOverlapping(mockEvent[0], mockEvent[2])).toBeFalsy();
  });
});

describe('findOverlappingEvents', () => {
  const mockEvents = [
    {
      id: '1',
      title: '기존 회의',
      date: '2024-11-01',
      startTime: '09:00',
      endTime: '12:30',
      description: '기존 팀 미팅',
      location: '회의실 B',
      category: '업무',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 10,
    },
    {
      id: '2',
      title: '저녁 약속',
      date: '2024-11-30',
      startTime: '18:30',
      endTime: '20:00',
      description: '팀 저녁',
      location: '한우 고기집',
      category: '식사',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 15,
    },
  ] as Event[];

  it('새 이벤트와 겹치는 모든 이벤트를 반환한다', () => {
    const newEvent = {
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
    } as Event;
    expect(findOverlappingEvents(newEvent, mockEvents)).toEqual([mockEvents[1]]);
  });

  it('겹치는 이벤트가 없으면 빈 배열을 반환한다', () => {
    const newEvent = {
      title: '정기정검',
      date: '2024-12-01',
      startTime: '02:00',
      endTime: '06:00',
      description: '정기 정검',
      location: '사무실',
      category: '업무',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 60,
    } as Event;
    expect(findOverlappingEvents(newEvent, mockEvents)).toEqual([]);
  });
});
