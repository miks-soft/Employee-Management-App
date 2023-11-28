export type RequestsWorktime = {
  startWorktime: PickApiData<'/api/v1/worktime/start', 'post'>;
  pauseWorktime: PickApiData<'/api/v1/worktime/pause', 'post'>;
  stopWorktime: PickApiData<'/api/v1/worktime/stop', 'post'>;
  getTodayWorktime: PickApiData<'/api/v1/worktime/today', 'get'>;
};
