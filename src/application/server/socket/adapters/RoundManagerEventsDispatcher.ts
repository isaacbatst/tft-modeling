import {
  RoundsManagerState,
  RoundsManagerEventsDispatcher,
} from '../../../../domain/usecases/GameStart/GameMoments';
import {GameSocketIoServer} from '../SocketServer';

export class SocketIoRoundManagerEventsDispatcher
implements RoundsManagerEventsDispatcher {
  constructor(private socketServer: GameSocketIoServer) {}

  public roundStart(state: RoundsManagerState): void {
    this.socketServer.emit('roundStart', state);
  }
}
