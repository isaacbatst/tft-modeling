import {
  GameEventDispatchers, GamePlayerDTO,
} from '../../../domain/entities/Game/Game';
import {SocketServer} from '../SocketServer';

export class SocketIOGameEventsDispatcher implements
  GameEventDispatchers {
  constructor(private socket: SocketServer) {}

  playerAdded(players: GamePlayerDTO[]): void {
    this.socket.emit('playerAdded', players);
  }
}
