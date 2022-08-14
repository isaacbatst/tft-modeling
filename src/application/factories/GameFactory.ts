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
import {
  SocketIOCarouselEventsDispatcher,
} from '../socket/adapters/CarouselEventsDispatcherAdapter';
import {
  SocketIOGameEventsDispatcher,
} from '../socket/adapters/GameEventDispatcherAdapter';
import {SocketServer} from '../socket/SocketServer';

export class GameFactory {
  static make(socket: SocketServer): Game {
    const carouselEventsDispatchers = new SocketIOCarouselEventsDispatcher(
        socket,
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
    const playersList = new GamePlayersList([]);
    const gameEventDispatchers = new SocketIOGameEventsDispatcher(socket);
    const game = new Game(
        deck, playersList, roundsManager, gameEventDispatchers);

    return game;
  }
}
