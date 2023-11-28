import React, { useEffect } from 'react';

import { useIsFocused } from '@react-navigation/native';

import {
  ObjectRoutes,
  ObjectScreenProps,
} from '#navigation/Main/Objects/types';

import { useGetObjectsQuery } from '#api/controllers/EmployeeObjects';

import { DTOObject } from '#generated/types';

import Layout from './layout';

type NavigationProps = ObjectScreenProps<ObjectRoutes.List>;

const Container: React.FC<NavigationProps> = props => {
  const objectsQuery = useGetObjectsQuery();

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      objectsQuery.refetch();
    }
  }, [isFocused]);

  return (
    <Layout
      /**
       *Options
       */
      isLoading={objectsQuery.isLoading}
      objects={objectsQuery.data}
      /**
       *Methods
       */
      {...props}
    />
  );
};

type PassingStates = {};

type PassingProps = {
  objects?: DTOObject[];
  isLoading: boolean;
};

export type ViewProps = NavigationProps &
  PassingStates &
  getSetStateProps<PassingStates> &
  PassingProps;

export default Container;
