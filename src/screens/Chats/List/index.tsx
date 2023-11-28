import React from 'react';

import { CompositeScreenProps } from '@react-navigation/native';

import { ChatsRoutes, ChatsScreenProps } from '#navigation/Main/Chats/types';
import { AppRoutes, AppScreenProps } from '#navigation/types';

import { useGetChatsQuery } from '#api/controllers/Messages';

import { useSelector } from '#store';
import { ChatsSelectors, UIChat } from '#store/slices/chats';

import Layout from './layout';

type NavigationProps = CompositeScreenProps<
  ChatsScreenProps<ChatsRoutes.List>,
  AppScreenProps<AppRoutes>
>;

const Container: React.FC<NavigationProps> = props => {
  const chatsQuery = useGetChatsQuery();

  const chatsNormalized = useSelector(ChatsSelectors.selectAll);

  return (
    <Layout
      /**
       *Options
       */
      chats={chatsNormalized}
      isLoading={chatsQuery.isLoading}
      /**
       *Methods
       */
      {...props}
    />
  );
};

type PassingStates = {};

type PassingProps = {
  chats: UIChat[];
  isLoading: boolean;
};

export type ViewProps = NavigationProps &
  PassingStates &
  getSetStateProps<PassingStates> &
  PassingProps;

export default Container;
