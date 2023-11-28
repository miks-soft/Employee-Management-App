import React from 'react';

import {
  ObjectRoutes,
  ObjectScreenProps,
} from '#navigation/Main/Objects/types';

import { useGetObjectPlanQuery } from '#api/controllers/EmployeeObjects';

import { DTOObjectTimeTrack } from '#generated/types';

import Layout from './layout';

type NavigationProps = ObjectScreenProps<ObjectRoutes.TrackedTime>;

const Container: React.FC<NavigationProps> = props => {
  const planQuery = useGetObjectPlanQuery({
    path: {
      object: props.route.params.id,
    },
  });

  return (
    <Layout
      /**
       *Options
       */
      isLoading={planQuery.isLoading}
      timeTracks={planQuery.data}
      /**
       *Methods
       */
      {...props}
    />
  );
};

type PassingStates = {};

type PassingProps = {
  timeTracks?: DTOObjectTimeTrack[];
  isLoading: boolean;
};

export type ViewProps = NavigationProps &
  PassingStates &
  getSetStateProps<PassingStates> &
  PassingProps;

export default Container;
