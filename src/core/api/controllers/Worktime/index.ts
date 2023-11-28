import { axiosBaseQuery } from '#api';

import { RequestsWorktime as Requests } from './types';

export class WorktimeAPIRaw {
  static async pause() {
    return axiosBaseQuery({
      url: '/worktime/pause',
      method: 'post',
      throwErrors: true,
    }) as Requests['pauseWorktime']['response'];
  }

  static async start(args: Requests['startWorktime']['args']) {
    return axiosBaseQuery({
      url: '/worktime/start',
      method: 'post',
      throwErrors: true,
      ...args,
    }) as Requests['startWorktime']['response'];
  }

  static async stop() {
    return axiosBaseQuery({
      url: '/worktime/stop',
      method: 'post',
      throwErrors: true,
    }) as Requests['stopWorktime']['response'];
  }

  static async canStart() {
    return axiosBaseQuery({
      url: '/worktime/can-start',
      method: 'get',
      throwErrors: true,
    }) as Promise<{ data: boolean }>;
  }

  static async getTodayWorktime(args: Requests['getTodayWorktime']['args']) {
    return axiosBaseQuery({
      url: '/worktime/today',
      method: 'get',
      ...args,
    }) as unknown as { data: Requests['getTodayWorktime']['response'] };
  }

  static async getTodayDinner() {
    return axiosBaseQuery({
      url: '/worktime/today-dinner',
      method: 'get',
    });
  }
}
