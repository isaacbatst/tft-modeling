import {
  ICarouselBoard,
  CarouselEventsDispatchers,
} from '../../../domain/entities/Game/RoundsManager/Carousel';
import {SocketServer} from '../SocketServer';

export class SocketIOCarouselEventsDispatcher implements
  CarouselEventsDispatchers {
  constructor(private socket: SocketServer) {}

  carouselStart(board: ICarouselBoard): void {
    this.socket.emit('carouselStart', board);
  };
  carouselEnd(): void {
    this.socket.emit('carouselEnd');
  };
  releasePlayers(): void {
    this.socket.emit('releasePlayers');
  };
  releaseCountdownChange(time: number): void {
    this.socket.emit('releaseCountdownChange', time);
  };
}
