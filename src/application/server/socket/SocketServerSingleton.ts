import {
  PlayerDisconnectionService,
} from
  '../../../domain/usecases/PlayerDisconnection/PlayerDisconnectionService';
import {CookiesHandler} from '../cookies/CookiesHandler';
import {GameSocket} from './interfaces';
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

    const server = SocketServerFactory.make(res);
    this.attachEvents(server);

    return server;
  }

  static attachEvents(socketServer: GameSocketIoServer) {
    socketServer
        .on('connection', this.handleConnection);
  }

  static handleConnection(socket: GameSocket) {
    socket.on('disconnect', async () => {
      const cookies = socket.request.headers.cookie;
      const parsed = CookiesHandler.parse(cookies || '');
      const id = parsed[CookiesHandler.COOKIE_NAME];

      if (id) {
        const disconnectService = new PlayerDisconnectionService();
        await disconnectService.execute();
      }
    });
  }
}
