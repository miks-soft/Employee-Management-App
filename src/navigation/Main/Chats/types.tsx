import { StackScreenProps } from '@react-navigation/stack';

export enum ChatsRoutes {
  List = 'ChatsList',
  Search = 'ChatsSearch',
}

export type ChatsParamList = {
  [ChatsRoutes.List]: undefined;
  [ChatsRoutes.Search]: undefined;
};

export type ChatsScreenProps<RouteName extends ChatsRoutes> = StackScreenProps<
  ChatsParamList,
  RouteName
>;
