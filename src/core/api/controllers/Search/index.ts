import { Query } from '#api';

import { RequestsSearch as Requests } from './types';

const SearchAPI = Query.injectEndpoints({
  endpoints: build => ({
    searchNewChat: build.query<
      Requests['searchChat']['response'],
      Requests['searchChat']['args']
    >({
      query: args => ({
        url: '/search/chat',
        method: 'get',
        ...args,
      }),
      transformResponse: (response: {
        data: Requests['searchChat']['response'];
      }) => response.data,
    }),
  }),
});

export const { useSearchNewChatQuery } = SearchAPI;
