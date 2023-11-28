export type RequestsEmployeeObjects = {
  getObjects: PickApiData<'/api/v1/employee/objects', 'get'>;
  getObject: PickApiData<'/api/v1/employee/objects/{object}', 'get'>;
  getObjectPlan: PickApiData<'/api/v1/employee/objects/{object}/plan', 'get'>;
};
