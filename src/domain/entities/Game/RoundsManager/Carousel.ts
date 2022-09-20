import {IPlayer} from '../Game';
import {PlayerCoupleDTO} from '../PlayersManager/PlayersList';
import {IGameRoundMoment} from './GameRoundMomentsList';

export interface IGameCountdown {
  subscribe(callback: (time: number) => void): () => void;
  start(roundTime: number): Promise<void>;
}

export interface ICharacterInCarousel {
  character: { name: string },
  item: { name: string }
}
export interface ICarouselBoard {
  getAll(): ICharacterInCarousel[]
}

export interface DeckForCarousel {
  takeRandomCarouselBoard(): ICarouselBoard
}

export interface CarouselStartPlayerManager {
  makeCarouselCouples(): PlayerCoupleDTO[]
}

export interface CarouselState {
  releaseIndex: number,
  couples: PlayerCoupleDTO[],
  board: ICharacterInCarousel[]
}

export interface CarouselEventsDispatchers {
  carouselEnd: (state: CarouselState) => void,
  releasePlayers: (state: CarouselState) => void,
}

export class Carousel implements IGameRoundMoment {
  static FINAL_COUNTDOWN_TIME = 5;
  static PLAYERS_COUNTDOWN_TIME = 5;
  private static NAME = 'Escolha Compartilhada';

  constructor(
    private countdown: IGameCountdown,
    private dispatch: CarouselEventsDispatchers,
  ) {}

  public getName(): string {
    return Carousel.NAME;
  }

  public async start(
      players: IPlayer[], deck: DeckForCarousel,
  ): Promise<void> {
    const board = deck.takeRandomCarouselBoard();
    const couples = this.makeCouplesByLife(players);

    await this.releaseCouples(couples, board);

    await this.countdown.start(Carousel.FINAL_COUNTDOWN_TIME);

    this.dispatch.carouselEnd({
      releaseIndex: couples.length - 1,
      board: board.getAll(),
      couples,
    });
  }

  private async releaseCouples(
      couples: PlayerCoupleDTO[], board: ICarouselBoard,
  ) {
    for (let index = 0; index < couples.length; index += 1) {
      this.dispatch.releasePlayers({
        releaseIndex: index,
        board: board.getAll(),
        couples,
      });

      await this.countdown
          .start(Carousel.PLAYERS_COUNTDOWN_TIME);
    }
  }

  private makeCouplesByLife(players: IPlayer[]): PlayerCoupleDTO[] {
    const playersSortedByLife = this.sortPlayersByLife(players);
    const couples = this.makeCouples(playersSortedByLife);

    return couples;
  }

  private makeCouples(players: IPlayer[]): PlayerCoupleDTO[] {
    const couples: PlayerCoupleDTO[] = [];

    for (let index = 0; index < players.length; index += 2) {
      const player = players[index];
      const nextPlayer = players[index + 1];

      // TODO should handle "player shadow" strategy
      if (nextPlayer) {
        couples.push([player, nextPlayer]);
      }
    }

    return couples;
  }

  private sortPlayersByLife(players: IPlayer[]): IPlayer[] {
    return players.slice()
        .sort((a, b) => {
          return a.life - b.life;
        });
  }
}
