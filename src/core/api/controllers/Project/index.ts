import { Query } from '#api';

import { DTOProjectSchedule, DTOProjectVacancy } from '#generated/types';

import { RequestsProject as Requests } from './types';

const ProjectAPI = Query.injectEndpoints({
  endpoints: build => ({
    getProjectsTodaySchedule: build.query<
      DTOProjectSchedule[],
      Requests['getProjectsTodaySchedule']['args']
    >({
      query: () => ({
        url: '/project/plan',
        method: 'get',
      }),
    }),
    getProjectSchedule: build.query<
      Required<DTOProjectVacancy>,
      Requests['getProjectSchedule']['args']
    >({
      query: args => ({
        url: '/project/plan/{plan}',
        method: 'get',
        ...args,
      }),
    }),
  }),
});

export const { useGetProjectsTodayScheduleQuery, useGetProjectScheduleQuery } =
  ProjectAPI;
