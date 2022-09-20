import {IPlayer} from '../../entities/Game/Game';
import {Player} from '../../entities/Game/Player';

export interface JoinGameRepository {
  findPlayerById(playerId: string): Promise<IPlayer | null>,
  add(player: IPlayer, gameId: string): Promise<void>
  getLobbySize(gameId: string): Promise<number | null>
  setPlayerConnected(id: string, connected: boolean): Promise<void>
}

export class JoinGameService {
  constructor(
    private repository: JoinGameRepository,
  ) {}

  public async execute(playerId: string, gameId: string) {
    const player = await this.repository.findPlayerById(playerId);

    const lobbySize = await this.repository.getLobbySize(gameId);

    if (lobbySize === null) throw new Error('GAME_NOT_FOUND');

    if (!player) {
      const newPlayer = new Player({
        id: playerId,
        isOwner: lobbySize === 0,
      });

      return this.repository.add(newPlayer.getDTO(), gameId);
    }

    return this.repository.setPlayerConnected(player.id, true);
  }
}
