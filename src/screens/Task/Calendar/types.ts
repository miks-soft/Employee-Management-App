import { MarkingProps } from 'react-native-calendars/src/calendar/day/marking';

export type UICalendarData<T extends unknown> = {
  [key in string]: { marker: MarkingProps; data: T[] };
};
