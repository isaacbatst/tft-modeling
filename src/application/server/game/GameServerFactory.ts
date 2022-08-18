import {Game} from '../../../domain/entities/Game/Game';
import {GameDeck} from '../../../domain/entities/Game/GameDeck/GameDeck';
import {
  PlayersList,
} from '../../../domain/entities/Game/PlayersManager/PlayersList';
import {
  PlayersManager,
} from '../../../domain/entities/Game/PlayersManager/PlayersManager';
import {
  Carousel,
} from '../../../domain/entities/Game/RoundsManager/Carousel';
import {
  GameCountdown,
} from '../../../domain/entities/Game/RoundsManager/GameCountdown';
import {
  GameRoundMomentsList,
} from '../../../domain/entities/Game/RoundsManager/GameRoundMomentsList';
import {
  RoundsManager,
} from '../../../domain/entities/Game/RoundsManager/RoundsManager';
import {
  SocketIOCarouselEventsDispatcher,
} from '../socket/adapters/CarouselEventsDispatcherAdapter';
import {
  SocketIOPlayersListDispatcher,
} from '../socket/adapters/PlayersListEventDispatcherAdapter';
import {
  GameServer,
} from '../game/GameServer';
import {
  GameSocketIoServer,
} from '../socket/SocketServer';

export class GameServerFactory {
  static make(socketServer: GameSocketIoServer) {
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
    const playersList = new PlayersList(playersListDispatcher);
    const playersManager = new PlayersManager(
        playersList,
    );

    const game = new Game(
        deck, playersManager, roundsManager,
    );

    const gameServer = new GameServer(
        socketServer,
        game,
    );

    return gameServer;
  }
}
