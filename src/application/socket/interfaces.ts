import {GameEventDispatchers} from '../../domain/entities/Game/Game';
import {
  CarouselEventsDispatchers,
} from '../../domain/entities/Game/RoundsManager/Carousel';

export interface ServerToClientEvents extends
  CarouselEventsDispatchers,
  GameEventDispatchers {
}

export interface ClientToServerEvents {
}

export interface InterServerEvents {
}

export interface SocketData {
};
