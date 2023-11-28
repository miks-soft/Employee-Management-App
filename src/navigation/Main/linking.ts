import { PathConfig, PathConfigMap } from '@react-navigation/native';

import { ObjectsLinking } from './Objects/linking';
import { ScheduleLinking } from './Schedule/linking';
import { MainParamList, MainRoutes } from './types';

export const MainLinks: PathConfigMap<MainParamList> = {
  [MainRoutes.Objects]: ObjectsLinking,
  [MainRoutes.Schedule]: ScheduleLinking,
};

export const MainLinking: PathConfig<MainParamList> = {
  screens: MainLinks,
};
