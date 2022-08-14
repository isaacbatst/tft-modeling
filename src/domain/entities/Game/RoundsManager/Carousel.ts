import {PlayerCouple} from '../Game';
import {IGameRoundMoment} from './RoundsManager';


export interface IGameCountdown {
  subscribe(callback: (time: number) => void): number;
  unsubscribe(index: number): void;
  start(roundTime: number): Promise<void>;
}

export interface ICharacter {
  getName(): string
}

export interface IItem {
  getName(): string
}

export interface ICharacterInGame {
  character: ICharacter,
  items: IItem[]
}
export interface CarouselBoard {
  getAll(): ICharacterInGame[]
}
export interface DeckForCarousel {
  takeRandomCarouselBoard(): CarouselBoard
}

export interface PlayersListForCarousel {
  makeCarouselCouples(): PlayerCouple[]
}

export interface CarouselEventsDispatchers {
  start: (board: CarouselBoard) => void,
  end: () => void,
  releasePlayers: () => void
}

export class Carousel implements IGameRoundMoment {
  static MOMENT_COUNTDOWN_TIME = 30;
  static PLAYERS_COUNTDOWN_TIME = 5;

  constructor(
    private momentCountdown: IGameCountdown,
    private playersCountdown: IGameCountdown,
    private dispatch: CarouselEventsDispatchers,
  ) {}

  async start(
      playersList: PlayersListForCarousel, deck: DeckForCarousel,
  ): Promise<void> {
    const board = deck.takeRandomCarouselBoard();
    const couples = playersList.makeCarouselCouples();

    this.dispatch.start(board);

    const momentCountdown = this.momentCountdown
        .start(Carousel.MOMENT_COUNTDOWN_TIME);


    for (let index = 0; index < couples.length; index += 1) {
      this.dispatch.releasePlayers();
      await this.playersCountdown
          .start(Carousel.PLAYERS_COUNTDOWN_TIME);
    }

    await momentCountdown;

    this.dispatch.end();
  }
}
