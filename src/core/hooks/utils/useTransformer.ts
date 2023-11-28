import { useMemo } from 'react';

import { IMessage } from 'react-native-gifted-chat';

import { BASE_URL } from '#env';

import { EnumChatRecepient } from '#config/enums';
import Images from '#config/images';

import { UIChat } from '#store/slices/chats';

import { DTOChat, DTOMessage } from '#generated/types';

const useTransformer = <T extends unknown, U extends unknown>(
  transformation: (value: T) => U,
  data?: T[],
) => {
  const memoizedValue = useMemo(
    () => (data?.length ? data.map(transformation) : undefined),
    [data],
  );

  return memoizedValue;
};

const Transformations = {
  DTOMessage: {
    to: {
      IGiftedChatMessage: (from: DTOMessage): IMessage => ({
        _id: from.created_at,
        text: from.text,
        createdAt: new Date(from.created_at),
        user: {
          _id: from.from_user_id! || from.project_id!,
          avatar: from.image
            ? `${BASE_URL}/${from.image}`
            : Images.ChatDefaultAvatar,
          name: from.name,
        },
      }),
    },
  },
  DTOChat: {
    to: {
      UIChat: (from: DTOChat): UIChat => {
        let recepient: UIChat['recepient'];

        if (from.project) {
          recepient = {
            type: EnumChatRecepient.PROJECT,
            name: from.project.title,
            id: from.project.id,
          };
        }

        if (from.toUser) {
          recepient = {
            type: EnumChatRecepient.USER,
            name: from.toUser.name,
            id: from.toUser.id,
            image: from.toUser.image ?? undefined,
          };
        }

        return {
          id: from.unique_id,
          text: from.text,
          count_unread: from.count_unread,
          updated_at: from.created_at,
          //@ts-expect-error
          recepient,
        };
      },
    },
  },
};

export { useTransformer, Transformations };
