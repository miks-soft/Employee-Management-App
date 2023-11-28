import { Query } from '#api';

import { DTOProject } from '#generated/types';

import { RequestsEmployee as Requests } from './types';

const EmployeeAPI = Query.injectEndpoints({
  endpoints: build => ({
    getStatistics: build.query<
      Requests['getStatistics']['response'],
      Requests['getStatistics']['args']
    >({
      query: args => ({
        url: '/employee/statistics',
        method: 'get',
        ...args,
      }),
    }),
    getEmployeeProjects: build.query<
      DTOProject[],
      Requests['getEmployeeProjects']['args']
    >({
      query: args => ({
        url: '/employee/{employee}/projects',
        method: 'get',
        ...args,
        //TODO delete pagination on BE
        params: {
          per_page: 1000,
        },
      }),
      transformResponse: (response: { data: DTOProject[] }) => response.data,
    }),
  }),
});

export const { useGetStatisticsQuery, useGetEmployeeProjectsQuery } =
  EmployeeAPI;
