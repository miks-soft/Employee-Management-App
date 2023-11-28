import React, { useMemo, useState } from 'react';

import { MarkedDates } from 'react-native-calendars/src/types';

import moment from 'moment';

import { TasksRoutes, TasksScreenProps } from '#navigation/Main/Tasks/types';

import { useGetTasksQuery } from '#api/controllers/Tasks';

import DateFormatter, { DateTimeFormats } from '#services/formatters/Date';

import { animateDecorator } from '#utils';

import { DTOTask } from '#generated/types';

import Layout from './layout';
import { UICalendarData } from './types';

type NavigationProps = TasksScreenProps<TasksRoutes.Calendar>;

const initialDate = new Date();

initialDate.setDate(1);

const modifyDateMonths = (date: Date, value: number) => {
  const newDate = new Date(date.valueOf());

  newDate.setDate(1);
  newDate.setMonth(date.getMonth() + value);

  return newDate;
};

const Container: React.FC<NavigationProps> = props => {
  const [anchorDate, setAnchorDate] = useState(initialDate);
  const [selectedDate, setSelectedDate] = useState(
    DateFormatter.format(new Date(), DateTimeFormats.dateOnlyHyphen),
  );

  const tasksQuery = useGetTasksQuery({
    params: {
      start_date: DateFormatter.trimDateWithoutTimezoneISO(
        moment(anchorDate).startOf('month').subtract(6, 'days').toISOString(),
      ),
      end_date: DateFormatter.trimDateWithoutTimezoneISO(
        moment(anchorDate).endOf('month').add(6, 'days').toISOString(),
      ),
    },
  });

  const onShowNextMonth = () => {
    setAnchorDate(modifyDateMonths(anchorDate, +1));
  };

  const onShowPreviousMonth = () => {
    setAnchorDate(modifyDateMonths(anchorDate, -1));
  };

  const calendarData = useMemo(() => {
    return (tasksQuery.data || []).reduce<UICalendarData<DTOTask>>(
      (acc, task) => {
        let date = DateFormatter.format(
          task.start_date!,
          DateTimeFormats.dateOnlyHyphen,
        );

        const endDate = DateFormatter.format(
          task.end_date!,
          DateTimeFormats.dateOnlyHyphen,
        );

        while (date <= endDate) {
          acc[date] = {
            marker: {
              marked: true,
            },
            data: [...(acc?.[date]?.data || []), task],
          };

          date = DateFormatter.format(
            moment(date).add(1, 'day').toISOString(),
            DateTimeFormats.dateOnlyHyphen,
          );
        }
        return acc;
      },
      {},
    );
  }, [tasksQuery.data]);

  const markedDates = useMemo(() => {
    return Object.entries(calendarData).reduce<MarkedDates>(
      (acc, [key, value]) => ({ ...acc, [key]: value.marker }),
      {},
    );
  }, [calendarData]);

  return (
    <Layout
      /**
       *Options
       */
      isLoading={tasksQuery.isLoading}
      markedDates={markedDates}
      selectedDate={selectedDate}
      todayTasks={calendarData[selectedDate]?.data || []}
      /**
       *Methods
       */
      onShowNextMonth={onShowNextMonth}
      onShowPreviousMonth={onShowPreviousMonth}
      setSelectedDate={animateDecorator(setSelectedDate)}
      {...props}
    />
  );
};

type PassingStates = {
  selectedDate: string;
};

type PassingProps = {
  isLoading: boolean;
  markedDates: MarkedDates;
  todayTasks: DTOTask[];
  onShowNextMonth: () => void;
  onShowPreviousMonth: () => void;
};

export type ViewProps = NavigationProps &
  PassingStates &
  getSetStateProps<PassingStates> &
  PassingProps;

export default Container;
