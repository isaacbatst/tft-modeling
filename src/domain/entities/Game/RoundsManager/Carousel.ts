import {PlayerCoupleDTO} from '../PlayersManager/PlayersList';
import {IGameRoundMoment} from './RoundsManager';

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

export interface CarouselPlayerManager {
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

  constructor(
    private finalCountdown: IGameCountdown,
    private playersCountdown: IGameCountdown,
    private dispatch: CarouselEventsDispatchers,
  ) {}

  async start(
      playerManager: CarouselPlayerManager, deck: DeckForCarousel,
  ): Promise<void> {
    const board = deck.takeRandomCarouselBoard();
    const couples = playerManager.makeCarouselCouples();

    for (let index = 0; index < couples.length; index += 1) {
      this.dispatch.releasePlayers({
        releaseIndex: index,
        board: board.getAll(),
        couples,
      });

      await this.playersCountdown
          .start(Carousel.PLAYERS_COUNTDOWN_TIME);
    }

    await this.finalCountdown.start(Carousel.FINAL_COUNTDOWN_TIME);

    this.dispatch.carouselEnd({
      releaseIndex: couples.length - 1,
      board: board.getAll(),
      couples,
    });
  }
}
