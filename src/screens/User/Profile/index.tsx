import React, { useEffect } from 'react';

import { CompositeScreenProps, useIsFocused } from '@react-navigation/native';

import { UserRoutes, UserScreenProps } from '#navigation/Main/User/types';
import { AppRoutes, AppScreenProps } from '#navigation/types';

import { useGetCurrentUserQuery } from '#api/controllers/Auth';

import { DTOUser } from '#generated/types';

import Layout from './layout';

type NavigationProps = CompositeScreenProps<
  UserScreenProps<UserRoutes.Profile>,
  AppScreenProps<AppRoutes>
>;

const Container: React.FC<NavigationProps> = props => {
  const currentUserQuery = useGetCurrentUserQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      currentUserQuery.refetch();
    }
  }, [isFocused]);

  return (
    <Layout
      /**
       *Options
       */
      isLoading={currentUserQuery.isLoading}
      user={currentUserQuery.data}
      /**
       *Methods
       */
      {...props}
    />
  );
};

type PassingStates = {};

type PassingProps = {
  isLoading: boolean;
  user?: DTOUser;
};

export type ViewProps = NavigationProps &
  PassingStates &
  getSetStateProps<PassingStates> &
  PassingProps;

export default Container;
