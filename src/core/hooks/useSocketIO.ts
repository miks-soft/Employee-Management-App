import { useEffect } from 'react';

import { useGetCurrentUserQuery } from '#api/controllers/Auth';

import ChatManager from '#services/ChatManager';
import { SocketEmitter, socket } from '#services/SocketClient';

import { useSelector } from '#store';

export const useSocketIO = () => {
  const isSignedIn = useSelector(store => store.app.isSignedIn);
  const currentUserQuery = useGetCurrentUserQuery(undefined, {
    skip: !isSignedIn,
  });

  useEffect(() => {
    socket.removeAllListeners();

    if (currentUserQuery.data && isSignedIn) {
      socket.on('connect', () => {
        SocketEmitter.join(currentUserQuery.data!);
      });

      socket.on('message', ChatManager.handleNewMessage);

      socket.connect();
    }

    return () => {
      socket.disconnect();
    };
  }, [currentUserQuery.data, isSignedIn, ChatManager.handleNewMessage]);
};
