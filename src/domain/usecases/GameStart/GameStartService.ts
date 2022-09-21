import {GamePlayers} from '../../entities/Game/GamePlayers';
import {IGameMoments, IGameDeck} from '../../entities/Game/interfaces';
import {IPlayer, Player} from '../../entities/Game/Player';

export interface GameStartRepository {
  getPlayerById(id: string):
    Promise<IPlayer & { ownedLobbyId: string | null } | null>,
  getLobbyPlayers(id: string): Promise<IPlayer[] | null>
}

enum GameStartErrors {
  PLAYER_NOT_FOUND = 'PLAYER_NOT_FOUND',
  PLAYER_IS_NOT_LOBBY_OWNER = 'PLAYER_IS_NOT_LOBBY_OWNER',
  LOBBY_NOT_FOUND = 'LOBBY_NOT_FOUND'
}

export class GameStartService {
  constructor(
    private repository: GameStartRepository,
    private moments: IGameMoments,
    private deck: IGameDeck,
  ) {}

  public async execute(playerId: string, lobbyId: string) {
    const player = await this.repository.getPlayerById(playerId);

    if (!player) {
      throw new Error(GameStartErrors.PLAYER_NOT_FOUND);
    }

    if (player.ownedLobbyId !== lobbyId) {
      throw new Error(GameStartErrors.PLAYER_IS_NOT_LOBBY_OWNER);
    }

    const playersDTO = await this.repository.getLobbyPlayers(lobbyId);

    if (!playersDTO) {
      throw new Error(GameStartErrors.LOBBY_NOT_FOUND);
    }

    const gamePlayers = new GamePlayers(playersDTO.map(Player.toInstance));

    this.moments
        .start(this.deck, gamePlayers);
  }
}
