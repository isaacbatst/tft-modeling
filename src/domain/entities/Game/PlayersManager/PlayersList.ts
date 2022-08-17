import {
  GamePlayerDTO,
  IHand,
} from '../Game';
import {GamePlayer} from '../GamePlayer';

import {IPlayersList} from './PlayersManager';

export enum PlayersListErrors {
  BELLOW_MIN_PLAYERS = 'BELLOW_MIN_PLAYERS',
  REPEATED_PLAYER = 'REPEATED_PLAYER',
  PLAYER_NOT_FOUND = 'PLAYER_NOT_FOUND'
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

export class PlayersList implements IPlayersList {
  constructor(
      private players: IGamePlayer[] = [],
  ) {}
  public getAll() {
    return this.players.map(this.toDTO);
  }

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
  }

  public findById(id: string): GamePlayerDTO | null {
    const player = this.players.find((player) => player.getId() === id);

    return player ? this.toDTO(player) : null;
  }

  public getLength(): number {
    return this.players.length;
  }

  public setPlayersGoldTo(value: number): void {
    this.players.forEach((player) => {
      player.setGold(value);
    });
  }

  public setPlayersHand(getHand: () => IHand): void {
    this.players.forEach((player) => {
      player.setHand(getHand());
    });
  }

  public setPlayerConnected(id: string, connected: boolean = true): void {
    const player = this.players.find((player) => player.getId() === id);

    if (!player) {
      throw new Error(PlayersListErrors.PLAYER_NOT_FOUND);
    }

    player.setConnected(connected);
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
