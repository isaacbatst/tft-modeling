import {
  GamePlayerDTO,
} from '../../../domain/entities/Game/Game';
import {
  PlayersListEventDispatcher,
} from '../../../domain/entities/Game/GamePlayersList';
import {GameSocketIoServer} from '../SocketServer';

export class SocketIOPlayersListDispatcher implements
  PlayersListEventDispatcher {
  constructor(private socket: GameSocketIoServer) {}

  playerAdded(players: GamePlayerDTO[]): void {
    this.socket.emit('playerAdded', players);
  }
}
