import {NextApiRequest} from 'next';
import {Game} from '../../domain/entities/Game/Game';
import {CookiesHandler} from '../server/cookies/CookiesHandler';
import {
  GameSocketIoServer,
  NextApiResponseServerIO,
} from '../server/socket/SocketServer';
import {GameFactory} from './GameFactory';

export class GameSingleton {
  private static game: Game | null = null;

  static getInstance(
      socketServer: GameSocketIoServer,
  ) {
    if (!GameSingleton.game) {
      const game = GameFactory.make(socketServer);
      GameSingleton.game = game;
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
