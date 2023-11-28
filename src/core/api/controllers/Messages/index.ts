import { Query } from '#api';

import { EnumChatRecepient } from '#config/enums';

import { Transformations } from '#hooks/utils/useTransformer';

import { store } from '#store';
import { ChatsActions } from '#store/slices/chats';

import { DTOChat, DTOMessage } from '#generated/types';

import { APITagsMessages as Tags, RequestsMessages as Requests } from './types';

const MessagesAPI = Query.injectEndpoints({
  endpoints: build => ({
    getChats: build.query<DTOChat[], Requests['getChats']['args']>({
      query: () => ({
        url: '/message',
        method: 'get',
      }),
      transformResponse: (response: DTOChat[]) => {
        store.dispatch(
          ChatsActions.setAll(response.map(Transformations.DTOChat.to.UIChat)),
        );

        return response;
      },
      providesTags: [Tags.CHATS],
    }),

    postMessage: build.mutation<
      Requests['postMessage']['response'],
      Requests['postMessage']['args']
    >({
      query: args => ({
        url: '/message',
        method: 'post',
        ...args,
      }),
    }),

    getChatMessages: build.query<
      DTOMessage[],
      { type: EnumChatRecepient; path: { recepientId: string } }
    >({
      query: args => ({
        url:
          args.type === EnumChatRecepient.PROJECT
            ? '/message/project/{recepientId}'
            : '/message/user/{recepientId}',
        method: 'get',
        params: {
          per_page: 100000,
        },
        ...args,
      }),
      transformResponse: (response: { data: DTOMessage[] }) => response.data,
    }),
  }),
});

export const {
  useGetChatsQuery,
  useLazyGetChatsQuery,
  useGetChatMessagesQuery,
  usePostMessageMutation,
} = MessagesAPI;
export default MessagesAPI;
