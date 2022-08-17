import {
  CarouselEventsDispatchers,
  CarouselState,
} from '../../../../domain/entities/Game/RoundsManager/Carousel';
import {GameSocketIoServer} from '../SocketServer';

export class SocketIOCarouselEventsDispatcher implements
  CarouselEventsDispatchers {
  constructor(private socket: GameSocketIoServer) {}

  carouselEnd(state: CarouselState): void {
    this.socket.emit('carouselEnd', state);
  };
  releasePlayers(state: CarouselState): void {
    this.socket.emit('releasePlayers', state);
  };
}
