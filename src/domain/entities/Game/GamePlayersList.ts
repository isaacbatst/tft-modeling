import {GamePlayerDTO
  , IGamePlayer, IGamePlayersList, PlayerCouple} from './Game';

export enum GamePlayersListErrors {
  BELLOW_MIN_PLAYERS = 'BELLOW_MIN_PLAYERS',
  REPEATED_PLAYER = 'REPEATED_PLAYER'
}

export interface PlayersListEventDispatcher {
  playerAdded(players: GamePlayerDTO[]): void
}

export class GamePlayersList implements IGamePlayersList {
  constructor(
      private players: IGamePlayer[],
      private dispatch: PlayersListEventDispatcher,
  ) {}

  getAll() {
    return this.players;
  }

  addPlayer(player: IGamePlayer) {
    this.players.push(player);
    this.dispatch.playerAdded(this.players.map(this.toDTO));
  }

  public validatePlayers(): void {
    if (this.players.length < 2) {
      throw new Error(GamePlayersListErrors.BELLOW_MIN_PLAYERS);
    }

    const hasRepeatedId = this.players
        .some((iPlayer, index) => {
          const foundIndex = this.players
              .findIndex((jPlayer) => jPlayer.getId() === iPlayer.getId());
          return foundIndex !== index;
        });

    if (hasRepeatedId) {
      throw new Error(GamePlayersListErrors.REPEATED_PLAYER);
    }
  }

  makeBattleCouples(): PlayerCouple[] {
    throw new Error('Not Implemented');
  }

  makeCarouselCouples(): PlayerCouple[] {
    const playersSortedByLife = this.players.slice().sort((a, b) => {
      return a.getLife() - b.getLife();
    });

    const couples: PlayerCouple[] = [];

    for (let index = 0; index < playersSortedByLife.length; index += 2) {
      const player = playersSortedByLife[index];
      const nextPlayer = playersSortedByLife[index + 1];

      // TODO should handle "player shadow" strategy
      if (nextPlayer) {
        couples.push([player, nextPlayer]);
      }
    }

    return couples;
  }

  private toDTO(player: IGamePlayer): GamePlayerDTO {
    return {
      gold: player.getGold(),
      id: player.getId(),
      life: player.getLife(),
    };
  }
}
