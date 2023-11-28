import { PathConfig, PathConfigMap } from '@react-navigation/native';

import { ObjectParamList, ObjectRoutes } from './types';

export const ObjectsLinks: PathConfigMap<ObjectParamList> = {
  [ObjectRoutes.TrackedTime]: 'objects/timeTracking',
};

export const ObjectsLinking: PathConfig<ObjectParamList> = {
  screens: ObjectsLinks,
};
