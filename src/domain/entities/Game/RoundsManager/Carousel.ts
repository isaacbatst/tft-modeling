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

export class Carousel implements IGameRoundMoment {
  static COUNTDOWN_TIME = 30;

  constructor(
    private countdown: IGameCountdown,
  ) {}

  async start(players: IGamePlayersList, deck: DeckForCarousel): Promise<void> {
    const board = deck.takeRandomCarouselBoard();

    console.log(
        'Starting carousel with',
        players.getAll().map((player) => player.getId()),
        board.getAll()
            .map((character) =>
              `${character.character.getName()} \
              with ${character.items[0].getName()}`,
            ),
    );

    await this.startCountdown();
  }

  private startCountdown() {
    return this.countdown.start(Carousel.COUNTDOWN_TIME);
  }
}
