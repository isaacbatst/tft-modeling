import {
  GamePlayerDTO, IHand, IPlayersManager,
} from '../Game';
import {
  PlayerCoupleDTO,
} from './PlayersList';

export interface IPlayersRepository {
  findById(id: string): GamePlayerDTO | null,
  getAll(): GamePlayerDTO[]
  add(props: { id: string, isOwner?: boolean }): void
  getLength(): number
  setPlayerConnected(id: string, connected?: boolean): void
  setPlayersGoldTo(value: number): void
  setPlayersHand(getHand: () => IHand): void
  incrementPlayersGold(
    getIncrement: (player: { gold: number }) => number
  ): void;
}

export enum PlayersManagerStartErrors {
  BELLOW_MIN_PLAYERS = 'BELLOW_MIN_PLAYERS',
}

export class PlayersManager implements IPlayersManager {
  constructor(
    private playersList: IPlayersRepository,
  ) {}

  public makeBattleCouples(): PlayerCoupleDTO[] {
    throw new Error('Method not implemented.');
  }

  public validatePlayers(): void {
    if (this.playersList.getLength() < 2) {
      throw new Error(PlayersManagerStartErrors.BELLOW_MIN_PLAYERS);
    }
  }

  public disconnectPlayer(id: string): void {
    const player =this.playersList.findById(id);

    if (player) {
      this.playersList.setPlayerConnected(id, false);
    }
  }

  public addPlayer(id: string): void {
    const player = this.playersList.findById(id);

    if (player) {
      this.playersList.setPlayerConnected(id);
      return;
    }

    const isOwner = this.playersList.getLength() === 0;
    this.playersList.add({id, isOwner});
  }

  public getPlayersList(): GamePlayerDTO[] {
    return this.playersList.getAll();
  }

  public setupPlayers(
      setup: { gold: number; getHand: () => IHand; },
  ): void {
    this.playersList.setPlayersGoldTo(setup.gold);
    this.playersList.setPlayersHand(setup.getHand);
  }

  public makeCarouselCouples(): PlayerCoupleDTO[] {
    const playersSortedByLife = this.playersList
        .getAll().slice().sort((a, b) => {
          return a.life - b.life;
        });

    const couples: PlayerCoupleDTO[] = [];

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

  public getById(id: string): GamePlayerDTO | null {
    return this.playersList.findById(id);
  }

  public refillToNextRound(baseGold: number, getHand: () => IHand): void {
    this.playersList.setPlayersHand(getHand);
    this.playersList.incrementPlayersGold((player) => {
      return this.getEconomyGold(player.gold) + baseGold;
    });
  }

  private getEconomyGold(gold: number): number {
    return Math.floor(gold / 10);
  }
}
