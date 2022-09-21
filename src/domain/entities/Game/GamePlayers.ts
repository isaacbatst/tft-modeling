import {Player} from './Player';

export enum GamePlayersErrors {
  INVALID_PLAYERS_LENGTH = 'INVALID_PLAYERS_LENGTH'
}

export class GamePlayers {
  constructor(
    private players: Player[],
  ) {
    this.validatePlayers();
  }

  private validatePlayers() {
    if (this.players.length !== 8) {
      throw new Error(GamePlayersErrors.INVALID_PLAYERS_LENGTH);
    }
  }
}
