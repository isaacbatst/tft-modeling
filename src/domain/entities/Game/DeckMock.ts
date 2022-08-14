import {IGameDeck, IHand} from './Game';

export class DeckMock implements IGameDeck {
  takeRandomHand = jest.fn((): IHand[] => {
    return [];
  });
  takeRandomCarouselBoard = jest.fn();
}
