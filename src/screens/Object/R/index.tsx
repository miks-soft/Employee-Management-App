import React from 'react';

import {
  ObjectRoutes,
  ObjectScreenProps,
} from '#navigation/Main/Objects/types';

import { useGetObjectQuery } from '#api/controllers/EmployeeObjects';

import { DTOObject, DTOObjectDetails } from '#generated/types';

import Layout from './layout';

type NavigationProps = ObjectScreenProps<ObjectRoutes.Read>;

const Container: React.FC<NavigationProps> = props => {
  const { data = props.route.params.defaultObject, isLoading } =
    useGetObjectQuery({
      path: {
        object: props.route.params.id,
      },
    });

  return (
    <Layout
      /**
       *Options
       */
      isLoading={isLoading}
      object={data}
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
  object?: DTOObjectDetails | DTOObject;
};

export type ViewProps = NavigationProps &
  PassingStates &
  getSetStateProps<PassingStates> &
  PassingProps;

export default Container;
