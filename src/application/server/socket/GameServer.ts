import {NextApiRequest} from 'next';
import {Game, GamePlayerDTO} from '../../../domain/entities/Game/Game';
import {CookiesHandler} from '../cookies/CookiesHandler';
import {GameSocket} from './interfaces';
import {GameSocketIoServer, NextApiResponseServerIO} from './SocketServer';

export class GameServer {
  constructor(
    private socketServer: GameSocketIoServer,
    private game: Game,
  ) {
    this.addGameListeners();
  }

  private addGameListeners() {
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

  public handleConnectedUser(
      req: NextApiRequest, res: NextApiResponseServerIO,
  ) {
    const token = CookiesHandler.findOrCreateCookie(req, res);
    this.game.handlePlayerConnected(token);

    return token;
  }

  public getPlayers(): GamePlayerDTO[] {
    return this.game.getPlayers();
  }
}
