import {IGameDeck, IHand} from '../Game';
import {
  ICarouselBoard, ICharacterInCarousel,
} from '../RoundsManager/Carousel';

class CarouselBoard implements ICarouselBoard {
  getAll(): ICharacterInCarousel[] {
    return [
      {
        character: {
          name: 'char-1',
        },
        item: {
          name: 'item-1',
        },
      },
      {
        character: {
          name: 'char-2',
        },
        item: {
          name: 'item-2',
        },
      },
    ];
  }
}

export class GameDeck implements IGameDeck {
  takeRandomHand(): IHand[] {
    return [];
  }
  takeRandomCarouselBoard(): ICarouselBoard {
    return new CarouselBoard();
  }
}
