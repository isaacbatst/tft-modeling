import {
  GamePlayerDTO,
} from '../../../domain/entities/Game/Game';
import {
  PlayersListEventDispatcher,
} from '../../../domain/entities/Game/PlayersManager/PlayersList';
import {GameSocketIoServer} from '../SocketServer';

export class SocketIOPlayersListDispatcher implements
  PlayersListEventDispatcher {
  constructor(private socketServer: GameSocketIoServer) {}

  playerAdded(players: GamePlayerDTO[]): void {
    this.socketServer.emit('playerAdded', players);
  }

  playerDisconnected(players: GamePlayerDTO[]): void {
    this.socketServer.emit('playerDisconnected', players);
  }

  playerReconnected(players: GamePlayerDTO[]): void {
    this.socketServer.emit('playerReconnected', players);
  }
}
