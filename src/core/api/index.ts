import NetInfo from '@react-native-community/netinfo';
import type { BaseQueryFn } from '@reduxjs/toolkit/query';
import { createApi, retry } from '@reduxjs/toolkit/query/react';

import * as Keychain from 'react-native-keychain';

import axios from 'axios';
import type { AxiosRequestConfig, AxiosError } from 'axios';
import lodash from 'lodash';

import { API_URL } from '#env';

import Crashlytics from '#services/Crashlytics';
import ToastManager from '#services/ToastManager';
import Tracker from '#services/Tracker';

import { animateLayout } from '#utils';
import Debug from '#utils/debug';

import { store } from '#store';
import { AppActions } from '#store/slices/app';

import { APITagsMessages } from './controllers/Messages/types';
import { APITagsTasks } from './controllers/Tasks/types';

export type BEError = {
  data: {
    errors: { [key in string]: string };
    message: string;
  };
  status: number;
};

type FetchArgs = {
  url: string;
  method: AxiosRequestConfig['method'];
  data?: AxiosRequestConfig['data'];
  params?: AxiosRequestConfig['params'];
  path?: AxiosRequestConfig['path'];
  throwErrors?: boolean;
};

const api = axios.create({
  timeout: 10000,
});

var handleNoInternet = lodash.debounce(() => {
  ToastManager.error('Отсутствует соединение с интернетом');
}, 2500);

const axiosBaseQuery = async ({
  url,
  method,
  data,
  params,
  path,
  throwErrors,
}: FetchArgs) => {
  const requestId = `${Date.now()}`.slice(-4);
  try {
    const credentials = await Keychain.getGenericPassword();
    const tokenWorkaround = await store.getState().app.tokenBackgoundWorkaround;

    Object.entries(path || {}).forEach(([k, v]) => {
      url = url.replace(`{${k}}`, encodeURIComponent(v));
    });

    !API_URL && Debug.error('no API_URL available, make sure .env file inited');

    const Authorization: string =
      credentials && credentials.password
        ? `Bearer ${credentials?.password}`
        : tokenWorkaround
        ? `Bearer ${tokenWorkaround}`
        : '';

    Crashlytics.log(
      `[API-${requestId}] Start`,
      method || '',
      url,
      JSON.stringify(params),
      JSON.stringify(data),
    );

    const { isConnected } = await NetInfo.fetch();

    if (!isConnected) {
      if (['PUT', 'POST', 'PATCH'].includes((method || '').toUpperCase())) {
        handleNoInternet();
      }
      throw {};
    }

    const result = await api({
      url: API_URL + url,
      method,
      data,
      params,
      headers: {
        Authorization,
      },
    });

    Crashlytics.log(
      `[API-${requestId}] Done`,
      method || '',
      url,
      JSON.stringify(result.data),
    );

    animateLayout();

    return {
      data: result?.data?.data || result?.data || {},
      meta: {
        ...result.data,
        timestamp: new Date().toISOString(),
        data: undefined,
      },
    };
  } catch (axiosError) {
    Debug.requestError('', axiosError);

    let err = axiosError as AxiosError;

    Crashlytics.log(
      `[API-${requestId}] Error`,
      method || '',
      url,
      JSON.stringify(err),
    );

    Crashlytics.log(`${JSON.stringify(err?.toJSON())}`);

    Crashlytics.log(`${JSON.stringify(err?.response)}`);

    if (err.response?.status === 401 && store.getState().app.isSignedIn) {
      store.dispatch(AppActions.setSignedIn(false));

      store.dispatch(Query.util.resetApiState());

      store.dispatch(AppActions.setToken(''));
      Keychain.resetGenericPassword();

      ToastManager.success('Сессия истекла, пожалуйста, войдите заново');

      Tracker.end(false);
    }

    const error = {
      error: {
        status: err.response?.status,
        data: err.response?.data || err.message,
      },
    };

    if (throwErrors) {
      throw error;
    } else {
      return error;
    }
  }
};

const baseQuery = retry(
  async (args: FetchArgs, _api) => {
    const result = await axiosBaseQuery(args);

    if (
      //@ts-ignore
      [422, 403, 401].includes(result.error?.status)
    ) {
      //@ts-ignore
      retry.fail(result.error);
    }

    return result;
  },
  {
    maxRetries: 2,
  },
);

const Query = createApi({
  reducerPath: 'api',
  baseQuery: baseQuery as BaseQueryFn<FetchArgs, unknown, BEError>,
  endpoints: () => ({}),
  tagTypes: [...Object.values(APITagsTasks), ...Object.values(APITagsMessages)],
  keepUnusedDataFor: 60,
});

export { Query, api, axiosBaseQuery };
