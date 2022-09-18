import {
  GamePlayerDTO, IGameDeck, IRoundsManager as IMomentsManager,
} from '../../entities/Game/Game';

export interface GameStartRepository {
  findById(id: string): Promise<GamePlayerDTO | null>,
  getPlayersLength(): Promise<number>
}

enum GameStartErrors {
  PLAYER_NOT_FOUND = 'PLAYER_NOT_FOUND',
  PLAYER_IS_NOT_LOBBY_OWNER = 'PLAYER_IS_NOT_LOBBY_OWNER',
  BELLOW_MIN_PLAYERS = 'BELLOW_MIN_PLAYERS'
}

export class GameStartService {
  private static INITIAL_GOLD = 3;
  private static GOLD_PER_ROUND = 5;

  constructor(
    private repository: GameStartRepository,
    private momentsManager: IMomentsManager,
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
