import {Server as HttpServer} from 'http';
import {Server as SocketIoServer} from 'socket.io';
import {
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents, SocketData,
} from '../server/socket/interfaces';
import {NextApiResponseServerIO} from '../server/socket/SocketServer';

export class SocketServerFactory {
  public static make(res: NextApiResponseServerIO) {
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
