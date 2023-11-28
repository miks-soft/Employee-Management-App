import { io } from 'socket.io-client';

import { WEBSOCKET_URL } from '#env';

import { DTOUser } from '#generated/types';

export const socket = io(WEBSOCKET_URL, { autoConnect: false });

const _emit = <U>(event: string, payload: any) =>
  new Promise<U>(resolve => {
    socket.emit(event, payload, (data: U) => {
      resolve(data);
    });
  });

export class SocketEmitter {
  static isOnline = (id: string) => _emit<boolean>('isOnline', id);
  static join = (user: DTOUser) => _emit('join', user);
}
