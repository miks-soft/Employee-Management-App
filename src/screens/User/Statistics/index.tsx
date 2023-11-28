import React, { useState } from 'react';

import { UserRoutes, UserScreenProps } from '#navigation/Main/User/types';

import { useGetStatisticsQuery } from '#api/controllers/Employee';
import { RequestsEmployee } from '#api/controllers/Employee/types';

import DateFormatter from '#services/formatters/Date';

import useErrorHandler from '#hooks/utils/useErrorHandler';

import Layout from './layout';

type NavigationProps = UserScreenProps<UserRoutes.Statistics>;

const startDayOfMonth = new Date();
startDayOfMonth.setDate(1);

const Container: React.FC<NavigationProps> = props => {
  const [startDate, setStartDate] = useState<Date | undefined>(startDayOfMonth);
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());

  const employeeStatisticsQuery = useGetStatisticsQuery({
    params: {
      date_from: startDate
        ? DateFormatter.trimDateWithoutTimezoneISO(startDate)
        : '',
      date_to: endDate ? DateFormatter.trimDateWithoutTimezoneISO(endDate) : '',
    },
  });

  useErrorHandler(() => {}, employeeStatisticsQuery);

  return (
    <Layout
      /**
       *Options
       */
      endDate={endDate}
      isLoading={employeeStatisticsQuery.isLoading}
      startDate={startDate}
      statistics={employeeStatisticsQuery.data}
      /**
       *Methods
       */
      setEndDate={setEndDate}
      setStartDate={setStartDate}
      {...props}
    />
  );
};

type PassingStates = {
  startDate?: Date;
  endDate?: Date;
};

type PassingProps = {
  isLoading: boolean;
  statistics: RequestsEmployee['getStatistics']['response'];
};

export type ViewProps = NavigationProps &
  PassingStates &
  getSetStateProps<PassingStates> &
  PassingProps;

export default Container;
