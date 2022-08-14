import {Socket} from 'socket.io-client';
import {ClientToServerEvents, ServerToClientEvents} from './interfaces';

export interface SocketClient extends Socket<
  ServerToClientEvents, ClientToServerEvents
> {}
