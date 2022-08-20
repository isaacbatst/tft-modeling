import {
  GamePlayerDTO,
  IHand,
} from '../Game';
import {GamePlayer} from '../GamePlayer';

import {IPlayersRepository} from './PlayersManager';

export enum PlayersListErrors {
  BELLOW_MIN_PLAYERS = 'BELLOW_MIN_PLAYERS',
  REPEATED_PLAYER = 'REPEATED_PLAYER',
  PLAYER_NOT_FOUND = 'PLAYER_NOT_FOUND'
}

export interface PlayersListEventDispatcher {
  playersUpdated(players: GamePlayerDTO[]): void
}

export interface IGamePlayer {
  getId(): string
  getLife(): number
  getGold(): number
  getIsOwner(): boolean
  decrementLife(value: number): void
  incrementGold(value: number): void
  setGold(value: number): void
  setHand(characters: IHand): void
  getConnected(): boolean
  setConnected(connected: boolean): void
}

export type PlayerCouple = [IGamePlayer, IGamePlayer];

export type PlayerCoupleDTO = [GamePlayerDTO, GamePlayerDTO];

export class PlayersList implements IPlayersRepository {
  constructor(
    private dispatch: PlayersListEventDispatcher,
    private players: IGamePlayer[] = [],
  ) {}
  public getAll() {
    return this.players.map(this.toDTO);
  }

  public findById(id: string): GamePlayerDTO | null {
    const player = this.players.find((player) => player.getId() === id);

    return player ? this.toDTO(player) : null;
  }

  public getLength(): number {
    return this.players.length;
  }

  // All updates should be dispatched
  public add(
      {
        id,
        isOwner = false,
      }: { id: string; isOwner?: boolean; }): void {
    const repeated = this.findById(id);

    if (repeated) {
      throw new Error(PlayersListErrors.REPEATED_PLAYER);
    }

    const player = new GamePlayer(id, isOwner);

    this.players.push(player);
    this.dispatchPlayersUpdate();
  }

  public setPlayersGoldTo(value: number): void {
    this.players.forEach((player) => {
      player.setGold(value);
    });

    this.dispatchPlayersUpdate();
  }

  public setPlayersHand(getHand: () => IHand): void {
    this.players.forEach((player) => {
      player.setHand(getHand());
    });
    this.dispatchPlayersUpdate();
  }

  public setPlayerConnected(id: string, connected: boolean = true): void {
    const player = this.players.find((player) => player.getId() === id);

    if (!player) {
      throw new Error(PlayersListErrors.PLAYER_NOT_FOUND);
    }

    player.setConnected(connected);
    this.dispatchPlayersUpdate();
  }

  public incrementPlayersGold(
      getIncrement: (player: { gold: number }) => number,
  ): void {
    this.players.forEach((player) => {
      const currentGold = player.getGold();

      const increment = getIncrement({
        gold: currentGold,
      });

      player.setGold(currentGold + increment);
    });

    this.dispatchPlayersUpdate();
  }

  private dispatchPlayersUpdate() {
    this.dispatch.playersUpdated(this.players.map(this.toDTO));
  }

  private toDTO(player: IGamePlayer): GamePlayerDTO {
    return {
      gold: player.getGold(),
      id: player.getId(),
      life: player.getLife(),
      connected: player.getConnected(),
      isOwner: player.getIsOwner(),
    };
  }
}
