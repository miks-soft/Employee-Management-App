export type RequestsMessages = {
  getChats: PickApiData<'/api/v1/message', 'get'>;
  postMessage: PickApiData<'/api/v1/message', 'post'>;
  getUserChatMessages: PickApiData<'/api/v1/message/user/{user_id}', 'get'>;
  getProjectChatMessages: PickApiData<
    '/api/v1/message/project/{project_id}',
    'get'
  >;
};

export enum APITagsMessages {
  'CHATS' = 'CHATS',
  'MESSAGES' = 'MESSAGES',
}
