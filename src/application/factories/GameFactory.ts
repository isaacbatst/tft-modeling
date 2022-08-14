import {NextApiRequest} from 'next';
import {Game} from '../../domain/entities/Game/Game';
import {GameDeck} from '../../domain/entities/Game/GameDeck/GameDeck';
import {GamePlayersList} from '../../domain/entities/Game/GamePlayersList';
import {Carousel} from '../../domain/entities/Game/RoundsManager/Carousel';
import {
  GameCountdown,
} from '../../domain/entities/Game/RoundsManager/GameCountdown';
import {
  GameRoundMomentsList,
} from '../../domain/entities/Game/RoundsManager/GameRoundMomentsList';
import {
  RoundsManager,
} from '../../domain/entities/Game/RoundsManager/RoundsManager';
import {CookiesHandler} from '../cookies/CookiesHandler';
import {
  SocketIOCarouselEventsDispatcher,
} from '../socket/adapters/CarouselEventsDispatcherAdapter';
import {
  SocketIOPlayersListDispatcher,
} from '../socket/adapters/PlayersListEventDispatcherAdapter';
import {GameSocket} from '../socket/interfaces';
import {
  GameSocketIoServer,
  NextApiResponseServerIO,
} from '../socket/SocketServer';
import {GameSocketServerFactory} from './GameSocketServerFactory';

export class GameFactory {
  private static game: Game | null = null;
  private static socketServer: GameSocketIoServer | null = null;

  static make(
      req: NextApiRequest,
      res: NextApiResponseServerIO,
  ) {
    const socketServer = GameSocketServerFactory.make(res);
    GameFactory.socketServer = socketServer;

    const game = GameFactory.getGameInstance(socketServer);

    GameFactory.handleConnectedUser(req, res, game);
    return game;
  }

  private static getGameInstance(socketServer: GameSocketIoServer) {
    if (!GameFactory.game) {
      const game = GameFactory.createGame(socketServer);
      GameFactory.addGameListeners();

      return game;
    }

    return GameFactory.game;
  }

  private static createGame(socketServer: GameSocketIoServer) {
    const carouselEventsDispatchers = new SocketIOCarouselEventsDispatcher(
        socketServer,
    );
    const momentCountdown = new GameCountdown();
    const playersCountdown = new GameCountdown();
    const carousel = new Carousel(
        momentCountdown, playersCountdown, carouselEventsDispatchers,
    );
    const momentsList = new GameRoundMomentsList(
        [carousel],
        1,
        [1],
    );
    const roundsManager = new RoundsManager(momentsList);
    const deck = new GameDeck();
    const playersListDispatcher = new SocketIOPlayersListDispatcher(
        socketServer,
    );
    const playersList = new GamePlayersList([], playersListDispatcher);
    const game = new Game(
        deck, playersList, roundsManager);

    GameFactory.game = game;

    return game;
  }

  private static handleConnectedUser(
      req: NextApiRequest, res: NextApiResponseServerIO,
      game: Game,
  ) {
    const token = CookiesHandler.findOrCreateCookie(req, res);
    game.handlePlayerConnected(token);
  }

  private static addGameListeners() {
    if (!GameFactory.socketServer) {
      throw new Error('NULL_SOCKET_SERVER');
    }

    GameFactory.socketServer.off('connection', GameFactory.handleConnection);

    GameFactory.socketServer.on('connection', GameFactory.handleConnection);
  }

  private static handleConnection(socket: GameSocket) {
    socket.on('disconnect', () => {
      const cookies = socket.request.headers.cookie;
      const parsed = CookiesHandler.parse(cookies || '');
      const {socketServer} = GameFactory;
      const {game} = GameFactory;
      const id = parsed[CookiesHandler.COOKIE_NAME];

      if (id && socketServer && game) {
        game.handlePlayerDisconnected(id);
        socketServer.emit('playerDisconnected', game.getPlayers());
      }
    });
  }
}
