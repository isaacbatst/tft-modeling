import {GamePlayerDTO} from '../../entities/Game/Game';

export interface PlayerConnectionRepository {
  findById(id: string): Promise<GamePlayerDTO | null>,
  add(props: { id: string, isOwner?: boolean }): Promise<void>
  getPlayersLength(): Promise<number>
  setPlayerConnected(id: string, connected?: boolean): Promise<void>
}

export class PlayerConnectionService {
  constructor(
    private repository: PlayerConnectionRepository,
  ) {}

  public async execute(id: string) {
    const player = await this.repository.findById(id);

    if (player) {
      return this.repository.setPlayerConnected(id);
    }

    const isLobbyEmpty = await this.getIsLobbyEmpty();

    await this.repository.add({
      id,
      isOwner: isLobbyEmpty,
    });
  }

  private async getIsLobbyEmpty() {
    const playersLength = await this.repository.getPlayersLength();
    return playersLength === 0;
  }
}
