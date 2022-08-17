import {GameServer} from '../server/socket/GameServer';
import {
  GameSocketIoServer,
} from '../server/socket/SocketServer';
import {GameServerFactory} from './GameServerFactory';

export class GameServerSingleton {
  private static gameServer: GameServer | null = null;

  static getInstance(
      socketServer: GameSocketIoServer,
  ) {
    if (!GameServerSingleton.gameServer) {
      const gameServer = GameServerFactory.make(socketServer);
      GameServerSingleton.gameServer = gameServer;
      return gameServer;
    }

    return GameServerSingleton.gameServer;
  }
}
