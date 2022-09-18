import {Socket} from 'socket.io';
import {
  PlayersListEventDispatcher,
} from '../../../domain/entities/Game/PlayersManager/PlayersList';
import {
  CarouselEventsDispatchers,
} from '../../../domain/entities/Game/RoundsManager/Carousel';
import {
  RoundsManagerEventsDispatcher,
} from '../../../domain/usecases/GameStart/GameMoments';

export interface ServerToClientEvents extends
  CarouselEventsDispatchers,
  PlayersListEventDispatcher,
  RoundsManagerEventsDispatcher {
}

export interface ClientToServerEvents {
}

export interface InterServerEvents {
}

export interface SocketData {
};

export interface GameSocket extends Socket<
  ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData> {}
