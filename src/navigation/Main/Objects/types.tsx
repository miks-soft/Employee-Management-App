import { StackScreenProps } from '@react-navigation/stack';

import { DTOObject } from '#generated/types';

export enum ObjectRoutes {
  List = 'ObjectsList',
  Read = 'ObjectRead',
  TrackedTime = 'ObjectTrackedTime',
}

export type ObjectParamList = {
  [ObjectRoutes.List]: undefined;
  [ObjectRoutes.Read]: { id: string; defaultObject: DTOObject };
  [ObjectRoutes.TrackedTime]: { id: string };
};

export type ObjectScreenProps<RouteName extends ObjectRoutes> =
  StackScreenProps<ObjectParamList, RouteName>;
