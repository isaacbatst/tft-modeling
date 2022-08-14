import {NextApiResponseServerIO, SocketServer} from '../socket/SocketServer';
import {Server as HttpServer} from 'http';
import {Server as SocketIoServer} from 'socket.io';

export class SocketServerFactory {
  static make(res: NextApiResponseServerIO): SocketServer {
    if (!res.socket.server.io) {
      console.log('Socket is initializing');
      const httpServer: HttpServer = res.socket.server as any;

      const io = new SocketIoServer(httpServer);
      res.socket.server.io = io;

      return io;
    } else {
      console.log('Socket is already running');
      return res.socket.server.io;
    }
  }
}
