import {Server as NetServer, Socket} from 'net';
import {NextApiResponse} from 'next';
import {Server} from 'socket.io';
import {
  ClientToServerEvents,
  InterServerEvents, ServerToClientEvents, SocketData} from './interfaces';

export class GameSocketIoServer extends Server<
ClientToServerEvents,
ServerToClientEvents,
InterServerEvents,
SocketData
> {}

export type NextApiResponseServerIO<T = any> = NextApiResponse<T> & {
  socket: Socket & {
    server: NetServer & {
      io: GameSocketIoServer
    }
  };
};

