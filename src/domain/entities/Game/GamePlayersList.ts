import {IGamePlayer} from './Game';

export enum GamePlayersListErrors {
  BELLOW_MIN_PLAYERS = 'BELLOW_MIN_PLAYERS',
  REPEATED_PLAYER = 'REPEATED_PLAYER'
}

export class GamePlayersList {
  private players: IGamePlayer[];

  constructor(players: IGamePlayer[]) {
    this.validatePlayers(players);
    this.players = players;
  }

  getAll() {
    return this.players;
  }

  private validatePlayers(players: IGamePlayer[]) {
    if (players.length < 2) {
      throw new Error(GamePlayersListErrors.BELLOW_MIN_PLAYERS);
    }

    const hasRepeatedId = players
        .some((iPlayer, index) => {
          const foundIndex = players
              .findIndex((jPlayer) => jPlayer.getId() === iPlayer.getId());
          return foundIndex !== index;
        });

    if (hasRepeatedId) {
      throw new Error(GamePlayersListErrors.REPEATED_PLAYER);
    }
  }
}
