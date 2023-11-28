import { Query } from '#api';

import { DTOUser } from '#generated/types';

import AuthAPI from '../Auth';
import { RequestsUser as Requests } from './types';

const UserAPI = Query.injectEndpoints({
  endpoints: build => ({
    updateUser: build.mutation<
      Requests['updateUser']['response'],
      Requests['updateUser']['args'] & { data: DTOUser }
    >({
      query: args => ({
        url: '/user',
        method: 'PUT',
        ...args,
      }),
      onQueryStarted: async (args, api) => {
        await api.queryFulfilled;
        api.dispatch(
          AuthAPI.util.updateQueryData('getCurrentUser', undefined, draft => ({
            ...draft,
            ...args.data,
          })),
        );
      },
    }),
    updateUserNotification: build.mutation<
      Requests['updateUser']['response'],
      Requests['updateUser']['args'] & {
        data: Pick<
          NonNullable<DTOUser>,
          | 'notification'
          | 'notification_from'
          | 'notification_to'
          | 'notification_type'
        >;
      }
    >({
      query: args => ({
        url: '/user/notification',
        method: 'PUT',
        ...args,
      }),
      onQueryStarted: async (args, api) => {
        await api.queryFulfilled;
        api.dispatch(
          AuthAPI.util.updateQueryData('getCurrentUser', undefined, draft => ({
            ...draft,
            ...args.data,
          })),
        );
      },
    }),
  }),
});

export const { useUpdateUserMutation, useUpdateUserNotificationMutation } =
  UserAPI;
