import { act, renderHook } from '@testing-library/react';

import { useSearch } from '../../hooks/useSearch.ts';
import { mockEvents as _mockEvents } from '../mockEvents.ts';

describe('useSearch >', () => {
  const mockEvents = _mockEvents;
  const mockDate = new Date('2024-11-01T00:00:00.000Z');

  beforeEach(() => {
    vi.setSystemTime(mockDate);
  });

  it('검색어가 비어있을 때 모든 이벤트를 반환해야 한다', () => {
    const { result } = renderHook(() => useSearch(mockEvents, mockDate, 'month'));

    expect(result.current.filteredEvents).toEqual(mockEvents);
  });

  it('검색어에 맞는 이벤트만 필터링해야 한다', () => {
    const { result } = renderHook(() => useSearch(mockEvents, mockDate, 'month'));

    act(() => {
      result.current.setSearchTerm('마감');
    });
    expect(result.current.filteredEvents).toEqual([mockEvents[2]]);
  });

  it('검색어가 제목, 설명, 위치 중 하나라도 일치하면 해당 이벤트를 반환해야 한다', () => {
    const { result } = renderHook(() => useSearch(mockEvents, mockDate, 'month'));
    act(() => {
      result.current.setSearchTerm('뷔페');
    });
    expect(result.current.filteredEvents).toEqual([mockEvents[1]]);

    act(() => {
      result.current.setSearchTerm('미팅');
    });
    expect(result.current.filteredEvents).toEqual([mockEvents[0]]);

    act(() => {
      result.current.setSearchTerm('마감');
    });
    expect(result.current.filteredEvents).toEqual([mockEvents[2]]);
  });

  it('현재 뷰(주간)에 해당하는 이벤트만 반환해야 한다', () => {
    const currentDate = new Date('2024-11-01T00:00:00.000Z');
    const { result } = renderHook(() => useSearch(mockEvents, currentDate, 'week'));

    // 첫 주에 해당하는 이벤트만 반환
    expect(result.current.filteredEvents).toEqual([mockEvents[0], mockEvents[1]]);
  });

  it('현재 뷰(월간)에 해당하는 이벤트만 반환해야 한다', () => {
    const currentDate = new Date('2024-11-01T00:00:00.000Z');

    const { result } = renderHook(() => useSearch(mockEvents, currentDate, 'month'));

    expect(result.current.filteredEvents).toEqual(mockEvents);
  });

  it("검색어를 '회의'에서 '점심'으로 변경하면 필터링된 결과가 즉시 업데이트되어야 한다", () => {
    const currentDate = new Date('2024-11-01T00:00:00.000Z');
    const { result } = renderHook(() => useSearch(mockEvents, currentDate, 'month'));

    act(() => {
      result.current.setSearchTerm('회의');
    });

    expect(result.current.filteredEvents).toEqual([mockEvents[0]]);

    act(() => {
      result.current.setSearchTerm('점심');
    });

    expect(result.current.filteredEvents).toEqual([mockEvents[1]]);
  });
});
