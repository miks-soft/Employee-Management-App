import { LinkingOptions, PathConfigMap } from '@react-navigation/native';

import { MainLinking } from './Main/linking';
import { AppParamList, AppRoutes } from './types';

export const DEFAULT_LINKING_PREFIX = 'Employee Management App://';

export const AppLinks: PathConfigMap<AppParamList> = {
  [AppRoutes.StackMain]: MainLinking,
};

export const linking: LinkingOptions<AppParamList> = {
  prefixes: ['Employee Management App://', 'https://Employee Management App.com'],
  config: {
    initialRouteName: AppRoutes.StackMain,
    screens: AppLinks,
  },
};
