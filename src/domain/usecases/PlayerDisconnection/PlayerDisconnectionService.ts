import {IPlayer} from '../../entities/Game/Game';

export interface PlayerDisconnectionRepository {
  findById(id: string): Promise<IPlayer | null>,
  setPlayerConnected(id: string, connected?: boolean): Promise<void>
}

export class PlayerDisconnectionService {
  constructor(
    private repository: PlayerDisconnectionRepository,
  ) {}

  public async execute(id: string) {
    const player = await this.repository.findById(id);

    if (player) {
      await this.repository.setPlayerConnected(id, false);
    }
  }
}
