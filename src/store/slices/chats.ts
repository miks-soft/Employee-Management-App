import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';

import { EnumChatRecepient } from '#config/enums';

import { RootState } from '#store';

export type UIChat = {
  id: string;
  text?: string;
  count_unread?: number;
  updated_at: string;
  recepient: {
    type: EnumChatRecepient;
    name: string;
    image?: string;
    id: string;
  };
};

export const ChatsAdapter = createEntityAdapter<UIChat>({
  selectId: chat => chat.id,
  sortComparer: (a, b) => {
    if (a.updated_at > b.updated_at) {
      return -1;
    }

    if (a.updated_at < b.updated_at) {
      return 1;
    }

    return 0;
  },
});

const chatsSlice = createSlice({
  name: 'chats',
  initialState: ChatsAdapter.getInitialState(),
  reducers: {
    upsertOne: ChatsAdapter.upsertOne,
    upsertMany: ChatsAdapter.upsertMany,
    setAll: ChatsAdapter.setAll,
  },
});

export default chatsSlice.reducer;
export const ChatsActions = chatsSlice.actions;
export const ChatsSelectors = ChatsAdapter.getSelectors<RootState>(
  state => state.chats,
);
