import {IGamePlayersList} from '../Game';
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

export interface CarouselEventsDispatchers {
  start: (board: CarouselBoard) => void,
  end: () => void
}

export class Carousel implements IGameRoundMoment {
  static COUNTDOWN_TIME = 30;

  constructor(
    private countdown: IGameCountdown,
    private dispatch: CarouselEventsDispatchers,
  ) {}

  async start(players: IGamePlayersList, deck: DeckForCarousel): Promise<void> {
    const board = deck.takeRandomCarouselBoard();

    this.dispatch.start(board);

    await this.countdown.start(Carousel.COUNTDOWN_TIME);

    this.dispatch.end();
  }
}
