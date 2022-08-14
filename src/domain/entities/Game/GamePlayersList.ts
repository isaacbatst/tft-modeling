import {GamePlayerDTO
  , IGamePlayersList, IHand} from './Game';
import {GamePlayer} from './GamePlayer';

export enum GamePlayersListErrors {
  BELLOW_MIN_PLAYERS = 'BELLOW_MIN_PLAYERS',
  REPEATED_PLAYER = 'REPEATED_PLAYER'
}

export interface PlayersListEventDispatcher {
  playerAdded(players: GamePlayerDTO[]): void,
  playerDisconnected(players: GamePlayerDTO[]): void
  playerReconnected(players: GamePlayerDTO[]): void
}

export interface IGamePlayer {
  getId(): string
  getLife(): number
  getGold(): number
  decrementLife(value: number): void
  incrementGold(value: number): void
  setGold(value: number): void
  setHand(characters: IHand): void
  getConnected(): boolean
  setConnected(connected: boolean): void
}

export type PlayerCouple = [IGamePlayer, IGamePlayer];

export type PlayerCoupleDTO = [GamePlayerDTO, GamePlayerDTO];

export class GamePlayersList implements IGamePlayersList {
  constructor(
      private players: IGamePlayer[],
      private dispatch: PlayersListEventDispatcher,
  ) {}

  public getAll() {
    return this.players;
  }

  public getDTOList() {
    return this.players.map(this.toDTO);
  }

  public addPlayer(id: string): void {
    const player = this.players.find((player) => {
      return player.getId() === id;
    });

    if (!player) {
      const player = new GamePlayer(id);
      this.players.push(player);
      this.dispatch.playerAdded(this.getDTOList());
    } else {
      player.setConnected(true);
      this.dispatch.playerReconnected(this.getDTOList());
    }
  }

  public setupPlayers(
      setup: { gold: number; getRandomHand: () => IHand; },
  ): void {
    this.players.forEach((player) => {
      player.setGold(setup.gold);
      player.setHand(setup.getRandomHand());
    });
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

  disconnectPlayer(id: string): void {
    const player =this.players.find((player) => player.getId() === id);
    if (player) {
      player.setConnected(false);
      this.dispatch.playerDisconnected(this.players.map(this.toDTO));
    }
  }

  makeBattleCouples(): PlayerCoupleDTO[] {
    throw new Error('Not Implemented');
  }

  makeCarouselCouples(): PlayerCoupleDTO[] {
    const playersSortedByLife = this.players.slice().sort((a, b) => {
      return a.getLife() - b.getLife();
    });

    const couples: PlayerCoupleDTO[] = [];

    for (let index = 0; index < playersSortedByLife.length; index += 2) {
      const player = playersSortedByLife[index];
      const nextPlayer = playersSortedByLife[index + 1];

      // TODO should handle "player shadow" strategy
      if (nextPlayer) {
        couples.push([this.toDTO(player), this.toDTO(nextPlayer)]);
      }
    }

    return couples;
  }

  private toDTO(player: IGamePlayer): GamePlayerDTO {
    return {
      gold: player.getGold(),
      id: player.getId(),
      life: player.getLife(),
      connected: player.getConnected(),
    };
  }
}
