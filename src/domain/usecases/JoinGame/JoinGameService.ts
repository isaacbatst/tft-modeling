import {IPlayer, Player} from '../../entities/Game/Player';

export interface JoinGameRepository {
  findPlayerById(playerId: string): Promise<IPlayer | null>,
  add(player: IPlayer, lobbyId: string): Promise<void>
  getLobbySize(lobbyId: string): Promise<number | null>
  setPlayerConnected(id: string, connected: boolean): Promise<void>
}

export class JoinGameService {
  constructor(
    private repository: JoinGameRepository,
  ) {}

  public async execute(playerId: string, lobbyId: string) {
    const lobbySize = await this.repository.getLobbySize(lobbyId);
    if (lobbySize === null) throw new Error('GAME_NOT_FOUND');

    const player = await this.findOrCreatePlayer(playerId, lobbyId);

    return this.repository.setPlayerConnected(player.id, true);
  }

  private async findOrCreatePlayer(playerId: string, lobbyId: string) {
    const player = await this.repository.findPlayerById(playerId);

    if (player) {
      return player;
    }

    const newPlayer = new Player({
      id: playerId,
    });

    await this.repository.add(newPlayer.getDTO(), lobbyId);

    return newPlayer.getDTO();
  }
}
