import { useToast } from '@chakra-ui/react';
import { act, renderHook, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';

import {
  setupMockHandlerCreation,
  setupMockHandlerDeletion,
  setupMockHandlerUpdating,
} from '../../__mocks__/handlersUtils.ts';
import { events } from '../../__mocks__/response/events.json' assert { type: 'json' };
import { useEventOperations } from '../../hooks/useEventOperations.ts';
import { server } from '../../setupTests.ts';
import { Event } from '../../types.ts';

const mockEventsResponse = [...events];

const toastSpy = vi.fn();

describe('useEventOperations Hook >', () => {
  beforeAll(() => {
    vi.spyOn(require('@chakra-ui/react'), 'useToast').mockImplementation(() => toastSpy); // useToast 스파이 설정
  });

  beforeEach(() => {
    vi.useRealTimers();
  });

  afterEach(() => {
    toastSpy.mockClear();
  });

  it('저장되어있는 초기 이벤트 데이터를 적절하게 불러온다', async () => {
    const { result } = renderHook(() => useEventOperations(false));

    await waitFor(() => expect(result.current.events.length).toBeGreaterThan(0));

    expect(result.current.events[0]).toEqual({
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
    });
  });

  it('정의된 이벤트 정보를 기준으로 적절하게 저장이 된다', async () => {
    const newEvent: Event = {
      id: '2',
      title: 'New Event',
      date: '2024-11-01',
      startTime: '09:00',
      endTime: '10:00',
      description: '오전 팀 미팅',
      location: '회의실 B',
      category: '업무',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 10,
    };
    const { result } = renderHook(() => useEventOperations(false));
    await act(async () => {
      await result.current.saveEvent(newEvent);
    });
    await waitFor(() => expect(result.current.events.length).toBe(2));
    expect(result.current.events[1].title).toBe('New Event');
  });

  it("새로 정의된 'title', 'endTime' 기준으로 적절하게 일정이 업데이트 된다", async () => {
    const updatedEvent = {
      ...mockEventsResponse[0],
      id: '1',
      title: '업데이트된 회의',
      endTime: '11:00',
      location: '회의실 A',
    } as Event;

    const { result } = renderHook(() => useEventOperations(true));

    await act(async () => {
      await result.current.saveEvent(updatedEvent);
    });

    await waitFor(() => expect(result.current.events[0].title).toBe('업데이트된 회의'));
    expect(result.current.events[0].endTime).toBe('11:00');
    expect(result.current.events[0].location).toBe('회의실 A');
  });

  it('존재하는 이벤트 삭제 시 에러없이 아이템이 삭제된다.', async () => {
    const { result } = renderHook(() => useEventOperations(false));

    await act(async () => {
      await result.current.deleteEvent('1');
    });

    await waitFor(() => expect(result.current.events.length).toBe(1));
  });

  it("이벤트 로딩 실패 시 '이벤트 로딩 실패'라는 텍스트와 함께 에러 토스트가 표시되어야 한다", async () => {
    server.use(
      http.get('/api/events', () => {
        return HttpResponse.error();
      })
    );

    const { result } = renderHook(() => useEventOperations(false));

    await act(
      async () =>
        await waitFor(() =>
          expect(toastSpy).toHaveBeenCalledWith({
            title: '이벤트 로딩 실패',
            status: 'error',
            duration: 3000,
            isClosable: true,
          })
        )
    );
  });

  it("존재하지 않는 이벤트 수정 시 '일정 저장 실패'라는 토스트가 노출되며 에러 처리가 되어야 한다", async () => {});

  it("네트워크 오류 시 '일정 삭제 실패'라는 텍스트가 노출되며 이벤트 삭제가 실패해야 한다", async () => {});
});
