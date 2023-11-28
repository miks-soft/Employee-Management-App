export type RequestsProject = {
  getProjectsTodaySchedule: PickApiData<'/api/v1/project/plan', 'get'>;
  getProjectSchedule: PickApiData<'/api/v1/project/plan/{plan}', 'get'>;
};
