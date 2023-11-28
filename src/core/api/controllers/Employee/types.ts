export type RequestsEmployee = {
  getStatistics: PickApiData<'/api/v1/employee/statistics', 'get'>;
  getEmployeeProjects: PickApiData<
    '/api/v1/employee/{employee}/projects',
    'get'
  >;
};
