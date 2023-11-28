export type RequestsUser = {
  updateUser: PickApiData<'/api/v1/user', 'put'>;
  updateUserNotification: PickApiData<'/api/v1/user/notification', 'put'>;
};
