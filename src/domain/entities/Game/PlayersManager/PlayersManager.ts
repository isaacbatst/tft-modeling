import {
  GamePlayerDTO, IPlayersManager, IHand,
} from '../Game';
import {
  PlayerCoupleDTO, PlayersListEventDispatcher,
} from './PlayersList';

export interface IPlayersList {
  findById(id: string): GamePlayerDTO | null,
  getAll(): GamePlayerDTO[]
  add(props: { id: string, isOwner?: boolean }): void
  getLength(): number
  setPlayerConnected(id: string, connected?: boolean): void
  setPlayersGoldTo(value: number): void
  setPlayersHand(getHand: () => IHand): void
}

export enum GamePlayersListErrors {
  BELLOW_MIN_PLAYERS = 'BELLOW_MIN_PLAYERS',
  REPEATED_PLAYER = 'REPEATED_PLAYER'
}

export class PlayersManager implements IPlayersManager {
  constructor(
    private playersList: IPlayersList,
    private dispatch: PlayersListEventDispatcher,
  ) {}

  public makeBattleCouples(): PlayerCoupleDTO[] {
    throw new Error('Method not implemented.');
  }

  public validatePlayers(): void {
    if (this.playersList.getLength() < 2) {
      throw new Error(GamePlayersListErrors.BELLOW_MIN_PLAYERS);
    }
  }

  public disconnectPlayer(id: string): void {
    const player =this.playersList.findById(id);

    if (player) {
      this.playersList.setPlayerConnected(id, false);
      this.dispatch.playerDisconnected(this.playersList.getAll());
    }
  }

  public addPlayer(id: string): void {
    const player = this.playersList.findById(id);

    if (player) {
      this.playersList.setPlayerConnected(id);
      this.dispatch.playerReconnected(this.getPlayersList());
      return;
    }

    const isOwner = this.playersList.getLength() === 0;
    this.playersList.add({id, isOwner});
    this.dispatch.playerAdded(this.getPlayersList());
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
}
