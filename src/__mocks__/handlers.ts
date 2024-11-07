import { randomUUID } from 'crypto';

import { http, HttpResponse } from 'msw';

import { Event, EventForm } from '../types';
import { events } from './response/events.json' assert { type: 'json' };

const mockEvents = [...events];

// ! HARD
// ! 각 응답에 대한 MSW 핸들러를 작성해주세요. GET 요청은 이미 작성되어 있는 events json을 활용해주세요.
export const handlers = [
  http.get('/api/events', () => {
    return HttpResponse.json(events);
  }),

  http.post<any, EventForm, Event>('/api/events', async ({ request }) => {
    const newEvent = await request.json();
    const newEventId = `${mockEvents.length + 1}`;

    const newEventResponse = { id: newEventId, ...newEvent };

    mockEvents.push(newEventResponse);

    return HttpResponse.json(newEventResponse, { status: 201 });
  }),

  http.put<{ id: string }, Event | EventForm>('/api/events/:id', async ({ request, params }) => {
    const { id } = params;
    const updatedEvent = await request.json();

    const updatedEventIndex = mockEvents.findIndex((ev) => ev.id === id);

    if (updatedEventIndex < 0) {
      return HttpResponse.text('Event not found', { status: 404 });
    }

    mockEvents[updatedEventIndex] = { ...mockEvents[updatedEventIndex], ...updatedEvent };
    return HttpResponse.json(updatedEvent);
  }),

  http.delete('/api/events/:id', ({ params }) => {
    // argument of the response resolver.
    const { id } = params;

    const deletedEventIndex = mockEvents.findIndex((ev) => ev.id === id);

    if (deletedEventIndex < 0) {
      return new HttpResponse('Event not found', { status: 404 });
    }
    mockEvents.filter((ev) => ev.id !== id);

    return HttpResponse.json({ status: 204 });
  }),
];
