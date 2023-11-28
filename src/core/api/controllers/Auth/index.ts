import { Query } from '#api';

import { RequestsAuth as Requests } from './types';

const AuthAPI = Query.injectEndpoints({
  endpoints: build => ({
    login: build.mutation<
      Requests['login']['response'],
      Requests['login']['args']
    >({
      query: args => ({
        url: '/auth/login',
        method: 'POST',
        ...args,
      }),
    }),
    logout: build.mutation<
      Requests['logout']['response'],
      Requests['logout']['args']
    >({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
    }),
    sendResetPasswordCode: build.mutation<
      Requests['send-reset-password-code']['response'],
      Requests['send-reset-password-code']['args']
    >({
      query: args => ({
        url: '/auth/send-reset-password-code',
        method: 'POST',
        ...args,
      }),
    }),
    resetPassword: build.mutation<
      Requests['reset-password']['response'],
      Requests['reset-password']['args']
    >({
      query: args => ({
        url: '/auth/reset-password',
        method: 'POST',
        ...args,
      }),
    }),
    setNewPassword: build.mutation<
      Requests['set-new-password']['response'],
      Requests['set-new-password']['args']
    >({
      query: args => ({
        url: '/auth/set-new-password',
        method: 'PUT',
        ...args,
      }),
    }),
    getCurrentUser: build.query<
      Requests['getCurrentUser']['response'],
      Requests['getCurrentUser']['args']
    >({
      query: () => ({
        url: '/user/current',
        method: 'GET',
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useSendResetPasswordCodeMutation,
  useResetPasswordMutation,
  useGetCurrentUserQuery,
  useSetNewPasswordMutation,
} = AuthAPI;
export default AuthAPI;
