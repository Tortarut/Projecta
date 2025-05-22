import { useContext } from 'react';
import { CalendarContext } from '../context/CalendarContext';

export const useCalendar = () => {
  const context = useContext(CalendarContext);
  if (context === undefined) {
    throw new Error('useCalendar должен использоваться внутри CalendarProvider');
  }
  return context;
};
