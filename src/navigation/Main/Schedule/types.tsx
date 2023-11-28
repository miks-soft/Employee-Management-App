import { StackScreenProps } from '@react-navigation/stack';

import { DTOProjectSchedule } from '#generated/types';

export enum ScheduleRoutes {
  List = 'SchedulesList',
  TimeTracking = 'TimeTracking',
}

export type ScheduleParamList = {
  [ScheduleRoutes.List]: undefined;
  [ScheduleRoutes.TimeTracking]?: { id?: string; default?: DTOProjectSchedule };
};

export type ScheduleScreenProps<RouteName extends ScheduleRoutes> =
  StackScreenProps<ScheduleParamList, RouteName>;
