import {GameSocketIoServer} from '../socket/SocketServer';
import {GameServer} from './GameServer';
import {GameServerFactory} from './GameServerFactory';

export class GameServerSingleton {
  private static gameServer: GameServer | null = null;

  static getInstance(
      socketServer: GameSocketIoServer,
  ) {
    console.log('game server', this.gameServer);
    if (!GameServerSingleton.gameServer) {
      const gameServer = GameServerFactory.make(socketServer);
      GameServerSingleton.gameServer = gameServer;
      return gameServer;
    }

    return GameServerSingleton.gameServer;
  }
}
