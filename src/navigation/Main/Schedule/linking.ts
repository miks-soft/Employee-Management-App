import { PathConfig, PathConfigMap } from '@react-navigation/native';

import { ScheduleParamList, ScheduleRoutes } from './types';

export const ScheduleLinks: PathConfigMap<ScheduleParamList> = {
  [ScheduleRoutes.TimeTracking]: 'schedule/time-tracking/:id',
};

export const ScheduleLinking: PathConfig<ScheduleParamList> = {
  screens: ScheduleLinks,
};
