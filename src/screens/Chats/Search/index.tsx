import React from 'react';

import { CompositeScreenProps } from '@react-navigation/native';

import { ChatsRoutes, ChatsScreenProps } from '#navigation/Main/Chats/types';
import { AppRoutes, AppScreenProps } from '#navigation/types';

import { useSearchNewChatQuery } from '#api/controllers/Search';
import { RequestsSearch } from '#api/controllers/Search/types';

import useDebouncedState from '#hooks/utils/useDebouncedState';

import Layout from './layout';

type NavigationProps = CompositeScreenProps<
  ChatsScreenProps<ChatsRoutes.Search>,
  AppScreenProps<AppRoutes.Chat>
>;

const Container: React.FC<NavigationProps> = props => {
  const [searchFor, setSearchFor, debouncedSearchFor] = useDebouncedState('');

  const searchNewChatQuery = useSearchNewChatQuery(
    {
      params: {
        query: searchFor ? debouncedSearchFor : '',
      },
    },
    {
      refetchOnMountOrArgChange: true,
    },
  );

  return (
    <Layout
      /**
       *Options
       */
      chatsFound={searchNewChatQuery.data}
      searchFor={searchFor}
      /**
       *Methods
       */
      setSearchFor={setSearchFor}
      {...props}
    />
  );
};

type PassingStates = {
  searchFor: string;
};

type PassingProps = {
  chatsFound: RequestsSearch['searchChat']['response'];
};

export type ViewProps = NavigationProps &
  PassingStates &
  getSetStateProps<PassingStates> &
  PassingProps;

export default Container;
