import {
  IPlayer,
} from '../../../../domain/entities/Game/Game';
import {
  PlayersListEventDispatcher,
} from '../../../../domain/entities/Game/PlayersManager/PlayersList';
import {GameSocketIoServer} from '../SocketServer';

export class SocketIOPlayersListDispatcher implements
  PlayersListEventDispatcher {
  constructor(private socketServer: GameSocketIoServer) {}

  playersUpdated(players: IPlayer[]): void {
    this.socketServer.emit('playersUpdated', players);
  }
}
