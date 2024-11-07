import { useMemo, useState } from 'react';

import { Event } from '../types';
import { getFilteredEvents } from '../utils/eventUtils';

export const useSearch = (events: Event[], currentDate: Date, view: 'week' | 'month') => {
  console.log('currentDate: ', currentDate);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEvents = useMemo(() => {
    console.log('currentDate: ', currentDate);
    return getFilteredEvents(events, searchTerm, currentDate, view);
  }, [events, searchTerm, currentDate, view]);

  return {
    searchTerm,
    setSearchTerm,
    filteredEvents,
  };
};
