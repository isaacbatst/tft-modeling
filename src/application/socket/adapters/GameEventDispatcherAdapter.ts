import {
  GameEventDispatchers, GamePlayerDTO,
} from '../../../domain/entities/Game/Game';
import {GameSocketIoServer} from '../SocketServer';

export class SocketIOGameEventsDispatcher implements
  GameEventDispatchers {
  constructor(private socket: GameSocketIoServer) {}

  playerAdded(players: GamePlayerDTO[]): void {
    this.socket.emit('playerAdded', players);
  }
}
