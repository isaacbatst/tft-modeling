import {Server as NetServer, Socket} from 'net';
import {NextApiResponse} from 'next';
import {Server} from 'socket.io';
import {
  ClientToServerEvents,
  InterServerEvents, ServerToClientEvents, SocketData} from './interfaces';

export type NextApiResponseServerIO = NextApiResponse & {
  socket: Socket & {
    server: NetServer & {
      io: SocketServer
    }
  };
};

export interface SocketServer extends Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
> {}
