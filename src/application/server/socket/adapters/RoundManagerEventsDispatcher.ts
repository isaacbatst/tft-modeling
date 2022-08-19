import {
  RoundManagerState,
  RoundsManagerEventsDispatcher,
} from '../../../../domain/entities/Game/RoundsManager/RoundsManager';
import {GameSocketIoServer} from '../SocketServer';

export class SocketIoRoundManagerEventsDispatcher
implements RoundsManagerEventsDispatcher {
  constructor(private socketServer: GameSocketIoServer) {}

  public roundStart(state: RoundManagerState): void {
    this.socketServer.emit('roundStart', state);
  }
}
