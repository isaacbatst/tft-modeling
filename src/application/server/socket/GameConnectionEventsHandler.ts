import {Game} from '../../../domain/entities/Game/Game';
import {CookiesHandler} from '../cookies/CookiesHandler';
import {GameSocket} from './interfaces';
import {GameSocketIoServer} from './SocketServer';

export class GameConnectionEventsHandler {
  constructor(
    private socketServer: GameSocketIoServer,
    private game: Game,
  ) {
  }

  public addGameListeners() {
    this.socketServer
        .off('connection', this.handleConnection);

    this.socketServer
        .on('connection', this.handleConnection);
  }

  private handleConnection(socket: GameSocket) {
    socket.on('disconnect', () => {
      const cookies = socket.request.headers.cookie;
      const parsed = CookiesHandler.parse(cookies || '');
      const id = parsed[CookiesHandler.COOKIE_NAME];

      if (id && this.socketServer && this.game) {
        this.game.handlePlayerDisconnected(id);
      }
    });
  }
}
