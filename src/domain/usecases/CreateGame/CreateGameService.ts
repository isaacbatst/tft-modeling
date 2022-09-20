import {ILobby as ILobby, IPlayer} from '../../entities/Game/Game';
import {Player} from '../../entities/Game/Player';
import {Games} from '../../entities/Games';

export interface CreateGameRepository {
  createGame(game: ILobby): Promise<void>
  createPlayer(player: IPlayer, gameId: string): Promise<void>
}

export class CreateGameService {
  constructor(
    private repository: CreateGameRepository,
  ) {}

  async execute(playerId: string, lobbyId: string) {
    await this.repository.createGame({
      id: lobbyId,
      round: 0,
      stage: 0,
      game: Games.DEFAULT,
    });

    const player = new Player({
      id: playerId,
      isOwner: true,
    });

    await this.repository.createPlayer(player.getDTO(), lobbyId);
  }
}
