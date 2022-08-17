import {Server as HttpServer} from 'http';
import {Server as SocketIoServer} from 'socket.io';
import {
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents, SocketData,
} from '../server/socket/interfaces';
import {
  GameSocketIoServer, NextApiResponseServerIO,
} from '../server/socket/SocketServer';

export class GameSocketServerFactory {
  static make(res: NextApiResponseServerIO): GameSocketIoServer {
    if (res.socket.server.io) {
      console.log('Socket is already running');
      return res.socket.server.io;
    }

    return this.createServer(res);
  }

  private static createServer(res: NextApiResponseServerIO) {
    console.log('Socket is initializing');
    const httpServer: HttpServer = res.socket.server as any;

    const io = new SocketIoServer<
      ClientToServerEvents,
      ServerToClientEvents,
      InterServerEvents,
      SocketData
    >(httpServer);

    res.socket.server.io = io;

    return io;
  }
}
