import {PlayerCoupleDTO} from '../GamePlayersList';
import {IGameRoundMoment} from './RoundsManager';

export interface IGameCountdown {
  subscribe(callback: (time: number) => void): () => void;
  start(roundTime: number): Promise<void>;
}

export interface ICharacter {
  getName(): string
}

export interface IItem {
  getName(): string
}

export interface ICharacterInGame {
  getCharacter(): ICharacter,
  getItems(): IItem[]
}
export interface ICarouselBoard {
  getAll(): ICharacterInGame[]
}
export interface DeckForCarousel {
  takeRandomCarouselBoard(): ICarouselBoard
}

export interface PlayersListForCarousel {
  makeCarouselCouples(): PlayerCoupleDTO[]
}

export interface CarouselEventsDispatchers {
  carouselStart: (board: ICarouselBoard) => void,
  carouselEnd: () => void,
  releasePlayers: () => void,
  releaseCountdownChange: (time: number) => void
}

export class Carousel implements IGameRoundMoment {
  static FINAL_COUNTDOWN_TIME = 5;
  static PLAYERS_COUNTDOWN_TIME = 5;

  constructor(
    private finalCountdown: IGameCountdown,
    private playersCountdown: IGameCountdown,
    private dispatch: CarouselEventsDispatchers,
  ) {}

  async start(
      playersList: PlayersListForCarousel, deck: DeckForCarousel,
  ): Promise<void> {
    const unsubscribe = this.playersCountdown
        .subscribe(this.dispatch.releaseCountdownChange);

    const board = deck.takeRandomCarouselBoard();
    const couples = playersList.makeCarouselCouples();

    this.dispatch.carouselStart(board);

    for (let index = 0; index < couples.length; index += 1) {
      this.dispatch.releasePlayers();
      await this.playersCountdown
          .start(Carousel.PLAYERS_COUNTDOWN_TIME);
    }

    await this.finalCountdown.start(Carousel.FINAL_COUNTDOWN_TIME);

    unsubscribe();
    this.dispatch.carouselEnd();
  }
}
