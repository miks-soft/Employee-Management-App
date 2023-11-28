import React, { useEffect } from 'react';

import { useIsFocused } from '@react-navigation/native';

import {
  ScheduleRoutes,
  ScheduleScreenProps,
} from '#navigation/Main/Schedule/types';

import { useGetProjectsTodayScheduleQuery } from '#api/controllers/Project';

import { DTOProjectSchedule } from '#generated/types';

import Layout from './layout';

type NavigationProps = ScheduleScreenProps<ScheduleRoutes>;

const Container: React.FC<NavigationProps> = props => {
  const scheduleQuery = useGetProjectsTodayScheduleQuery();
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      scheduleQuery.refetch();
    }
  }, [isFocused]);

  return (
    <Layout
      /**
       *Options
       */
      isLoading={scheduleQuery.isLoading}
      projectSchedules={scheduleQuery.data}
      /**
       *Methods
       */
      {...props}
    />
  );
};

type PassingStates = {};

type PassingProps = {
  projectSchedules?: DTOProjectSchedule[];
  isLoading: boolean;
};

export type ViewProps = NavigationProps &
  PassingStates &
  getSetStateProps<PassingStates> &
  PassingProps;

export default Container;
