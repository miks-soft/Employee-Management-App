import { Query } from '#api';

import {
  DTOObject,
  DTOObjectDetails,
  DTOObjectTimeTrack,
} from '#generated/types';

import { RequestsEmployeeObjects as Requests } from './types';

const EmployeeObjectsAPI = Query.injectEndpoints({
  endpoints: build => ({
    getObjects: build.query<DTOObject[], Requests['getObjects']['args']>({
      query: () => ({
        url: '/employee/objects',
        method: 'get',
      }),
    }),
    getObject: build.query<DTOObjectDetails, Requests['getObject']['args']>({
      query: args => ({
        url: '/employee/objects/{object}',
        method: 'get',
        ...args,
      }),
    }),
    getObjectPlan: build.query<
      DTOObjectTimeTrack[],
      Requests['getObjectPlan']['args']
    >({
      query: args => ({
        url: '/employee/objects/{object}/plan',
        method: 'get',
        ...args,
      }),
    }),
  }),
});

export const { useGetObjectQuery, useGetObjectsQuery, useGetObjectPlanQuery } =
  EmployeeObjectsAPI;
