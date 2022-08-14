import {GameDeck, IHand} from './Game';

export class DeckMock implements GameDeck {
  takeRandomHand = jest.fn((): IHand[] => {
    return [];
  });
  takeRandomCarouselBoard = jest.fn();
}
