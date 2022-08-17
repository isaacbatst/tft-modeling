import {NextApiRequest} from 'next';
import {Game} from '../../domain/entities/Game/Game';
import {CookiesHandler} from '../server/cookies/CookiesHandler';
import {
  GameConnectionEventsHandler,
} from '../server/socket/GameConnectionEventsHandler';
import {
  GameSocketIoServer,
  NextApiResponseServerIO,
} from '../server/socket/SocketServer';
import {GameFactory} from './GameFactory';
import {GameSocketServerFactory} from './GameSocketServerFactory';

export class GameSingleton {
  private static game: Game | null = null;

  static getInstance(
      req: NextApiRequest,
      res: NextApiResponseServerIO,
  ) {
    const socketServer = GameSocketServerFactory.make(res);

    const game = GameSingleton.getGameInstance(socketServer);

    return game;
  }

  private static getGameInstance(socketServer: GameSocketIoServer) {
    if (!GameSingleton.game) {
      const game = GameFactory.make(socketServer);
      const connectionEventsHandler = new GameConnectionEventsHandler(
          socketServer,
          game,
      );
      connectionEventsHandler.addGameListeners();

      return game;
    }

    return GameSingleton.game;
  }

  public static handleConnectedUser(
      req: NextApiRequest, res: NextApiResponseServerIO,
      game: Game,
  ) {
    const token = CookiesHandler.findOrCreateCookie(req, res);
    game.handlePlayerConnected(token);

    return token;
  }
}
