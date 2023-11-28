import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';

import { ScheduleList, TimeTracking } from '#screens';

import { DEFAULT_STACK_OPTIONS } from '#navigation/config';

import { useGetProjectsTodayScheduleQuery } from '#api/controllers/Project';

import { EnumTrackerStatus } from '#config/enums';

import { useSelector } from '#store';

import { ScheduleParamList, ScheduleRoutes } from './types';

const Schedule = createStackNavigator<ScheduleParamList>();

const StackSchedule = () => {
  const scheduleQuery = useGetProjectsTodayScheduleQuery();
  const tracker = useSelector(store => store.tracker);

  return (
    <Schedule.Navigator
      initialRouteName={
        tracker.status !== EnumTrackerStatus.READY ||
        tracker.project ||
        scheduleQuery.data?.length === 1
          ? ScheduleRoutes.TimeTracking
          : ScheduleRoutes.List
      }
      screenOptions={DEFAULT_STACK_OPTIONS}
    >
      <Schedule.Screen
        component={ScheduleList}
        name={ScheduleRoutes.List}
        options={{
          animationTypeForReplace: 'pop',
        }}
      />
      <Schedule.Screen
        component={TimeTracking}
        name={ScheduleRoutes.TimeTracking}
      />
    </Schedule.Navigator>
  );
};

export default StackSchedule;
