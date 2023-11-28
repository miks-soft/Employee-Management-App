export type RequestsAuth = {
  login: PickApiData<'/api/v1/auth/login', 'post'>;
  logout: PickApiData<'/api/v1/auth/logout', 'post'>;
  'send-reset-password-code': PickApiData<
    '/api/v1/auth/send-reset-password-code',
    'post'
  >;
  'reset-password': PickApiData<'/api/v1/auth/reset-password', 'post'>;
  'set-new-password': PickApiData<'/api/v1/auth/set-new-password', 'put'>;
  getCurrentUser: PickApiData<'/api/v1/user/current', 'get'>;
};
