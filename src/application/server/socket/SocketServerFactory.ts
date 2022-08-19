import {Server as HttpServer} from 'http';
import {GameSocketIoServer, NextApiResponseServerIO} from './SocketServer';

export class SocketServerFactory {
  public static make(res: NextApiResponseServerIO) {
    console.log('Socket is initializing');
    const httpServer: HttpServer = res.socket.server as any;

    const io = new GameSocketIoServer(httpServer);

    res.socket.server.io = io;

    return io;
  }
}
