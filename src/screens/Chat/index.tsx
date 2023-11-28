import React, { useEffect, useState } from 'react';

import { PatchCollection } from '@reduxjs/toolkit/dist/query/core/buildThunks';

import { IChatMessage, IMessage } from 'react-native-gifted-chat';

import { AppRoutes, AppScreenProps } from '#navigation/types';

import { useGetCurrentUserQuery } from '#api/controllers/Auth';
import {
  useGetChatMessagesQuery,
  useLazyGetChatsQuery,
  usePostMessageMutation,
} from '#api/controllers/Messages';

import ChatManager from '#services/ChatManager';
import { SocketEmitter } from '#services/SocketClient';

import { EnumChatRecepient } from '#config/enums';

import useErrorHandler from '#hooks/utils/useErrorHandler';
import { Transformations, useTransformer } from '#hooks/utils/useTransformer';

import { useSelector, useDispatch } from '#store';
import { ChatsActions, ChatsSelectors, UIChat } from '#store/slices/chats';

import { DTOUser } from '#generated/types';

import Layout from './layout';

type NavigationProps = AppScreenProps<AppRoutes.Chat>;

const Container: React.FC<NavigationProps> = props => {
  const chat =
    useSelector(store =>
      ChatsSelectors.selectById(store, props.route.params.id),
    ) || props.route.params.default;
  const isChatStarted = !!chat.id;

  const [isOnline, setIsOnline] = useState(false);
  const dispatch = useDispatch();

  const [getChats] = useLazyGetChatsQuery();
  const currentUserQuery = useGetCurrentUserQuery();
  const [postMessage, postMessageMeta] = usePostMessageMutation();

  const messagesQuery = useGetChatMessagesQuery({
    type: chat.recepient.type,
    path: {
      recepientId: chat.recepient.id,
    },
  });

  const messagesNormalized = useTransformer(
    Transformations.DTOMessage.to.IGiftedChatMessage,
    messagesQuery.data,
  );

  const checkIsUserOnline = async () => {
    const res = await SocketEmitter.isOnline(chat.recepient.id);
    setIsOnline(res);
  };

  const resetUnread = () => {
    //@ts-expect-error
    dispatch(ChatsActions.upsertOne({ ...chat, count_unread: 0 }));
  };

  const onSend = async (message: IChatMessage) => {
    let patch: PatchCollection;

    const payload = {
      id: `${message._id}`,
      name: currentUserQuery.data?.name!,
      image: currentUserQuery.data?.image!,
      created_at: new Date().toISOString(),
      text: message.text,
      from_user_id: currentUserQuery.data?.id!,
    };

    patch = ChatManager.appendMessage(
      chat.recepient?.type!,
      chat.recepient?.id!,
      payload,
    );

    try {
      await postMessage({
        data: {
          text: message.text,
          to_user_id:
            chat.recepient.type === EnumChatRecepient.USER
              ? chat.recepient.id
              : undefined,
          project_id:
            chat.recepient.type === EnumChatRecepient.PROJECT
              ? chat.recepient.id
              : undefined,
        },
      }).unwrap();
    } catch (e) {
      patch.undo();
    }

    if (isChatStarted) {
      ChatManager.updateChatPreview(
        chat.recepient.id!,
        message.text,
        payload.created_at,
      );
    } else {
      getChats();
    }
  };

  useEffect(() => {
    if (chat.count_unread) {
      resetUnread();
    }
  }, [chat, chat.count_unread]);

  useEffect(() => {
    checkIsUserOnline();
    const intervalId = setInterval(checkIsUserOnline, 10000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (isChatStarted) {
      messagesQuery.refetch();
    }
  }, [isChatStarted]);

  useErrorHandler(() => {}, messagesQuery);
  useErrorHandler(() => {}, postMessageMeta);

  return (
    <Layout
      /**
       *Options
       */
      chatRecepient={chat.recepient}
      isOnline={isOnline}
      messages={messagesNormalized}
      user={currentUserQuery.data!}
      /**
       *Methods
       */
      onSend={onSend}
      {...props}
    />
  );
};

type PassingStates = {};

type PassingProps = {
  messages?: IMessage[];
  user: DTOUser;
  chatRecepient?: UIChat['recepient'];
  isOnline: boolean;

  onSend: (message: IChatMessage) => void;
};

export type ViewProps = NavigationProps &
  PassingStates &
  getSetStateProps<PassingStates> &
  PassingProps;

export default Container;
