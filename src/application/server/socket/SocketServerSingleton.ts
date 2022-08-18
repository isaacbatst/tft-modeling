import {
  GameSocketIoServer, NextApiResponseServerIO,
} from './SocketServer';
import {SocketServerFactory} from './SocketServerFactory';

export class SocketServerSingleton {
  static getInstance(res: NextApiResponseServerIO): GameSocketIoServer {
    if (res.socket.server.io) {
      console.log('Socket is already running');
      return res.socket.server.io;
    }

    return SocketServerFactory.make(res);
  }
}
