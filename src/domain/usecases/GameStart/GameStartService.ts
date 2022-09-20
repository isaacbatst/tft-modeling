import {IGameMoments, IGameDeck} from '../../entities/Game/interfaces';
import {IPlayer} from '../../entities/Game/Player';

export interface GameStartRepository {
  findById(id: string): Promise<IPlayer | null>,
  getPlayersLength(): Promise<number>
}

enum GameStartErrors {
  PLAYER_NOT_FOUND = 'PLAYER_NOT_FOUND',
  PLAYER_IS_NOT_LOBBY_OWNER = 'PLAYER_IS_NOT_LOBBY_OWNER',
  BELLOW_MIN_PLAYERS = 'BELLOW_MIN_PLAYERS'
}

export class GameStartService {
  constructor(
    private repository: GameStartRepository,
    private momentsManager: IGameMoments,
    private deck: IGameDeck,
  ) {}

  public async execute(id: string) {
    const player = await this.repository.findById(id);

    if (!player) {
      throw new Error(GameStartErrors.PLAYER_NOT_FOUND);
    }

    if (!player.isOwner) {
      throw new Error(GameStartErrors.PLAYER_IS_NOT_LOBBY_OWNER);
    }

    await this.validatePlayers();

    this.momentsManager
        .startMoments(this.deck);
  }


  private async validatePlayers() {
    const playersLength = await this.repository.getPlayersLength();

    if (playersLength < 2) {
      throw new Error(GameStartErrors.BELLOW_MIN_PLAYERS);
    }
  }
}
