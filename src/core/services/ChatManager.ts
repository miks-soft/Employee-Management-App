import MessagesAPI from '#api/controllers/Messages';
import { APITagsMessages } from '#api/controllers/Messages/types';

import { EnumChatRecepient } from '#config/enums';

import { store } from '#store';
import { ChatsActions, ChatsSelectors } from '#store/slices/chats';

import { DTOMessage } from '#generated/types';

class ChatManager {
  static appendMessage = (
    type: EnumChatRecepient,
    recepientId: string,
    message: DTOMessage,
  ) =>
    store.dispatch(
      MessagesAPI.util.updateQueryData(
        'getChatMessages',
        {
          type,
          path: {
            recepientId: recepientId,
          },
        },
        draft => [message, ...draft],
      ),
    );

  static updateChatPreview = (
    id: string,
    text = '',
    updateDate = new Date().toISOString(),
    count_unread = 0,
  ) => {
    store.dispatch(
      //@ts-expect-error seems like wrong library typing, should be partial except id
      ChatsActions.upsertOne({
        id,
        text,
        updated_at: updateDate,
        count_unread,
      }),
    );
  };

  static handleNewMessage = (data: DTOMessage) => {
    const recepientId = data.project_id! || data.from_user_id!;

    const chat = ChatsSelectors.selectAll(store.getState()).find(
      el => recepientId === el.recepient.id,
    );

    if (!chat) {
      store.dispatch(MessagesAPI.util.invalidateTags([APITagsMessages.CHATS]));
      return;
    }

    this.updateChatPreview(
      chat.id,
      data.text,
      data.created_at,
      (chat?.count_unread || 0) + 1,
    );
    this.appendMessage(
      recepientId === data.project_id
        ? EnumChatRecepient.PROJECT
        : EnumChatRecepient.USER,
      recepientId,
      data,
    );
  };
}

export default ChatManager;
