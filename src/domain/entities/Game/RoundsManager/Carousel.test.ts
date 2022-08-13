import {CountdownMock} from './GameCountdownMock';
import {
  Carousel, CarouselBoard, DeckForCarousel, ICharacterInGame} from './Carousel';
import {GamePlayersListMock} from '../GamePlayersListMock';

class DeckMock implements DeckForCarousel {
  takeRandomCarouselBoard = jest.fn((): CarouselBoard => {
    return {
      getAll(): ICharacterInGame[] {
        return [
          {
            character: {
              getName() {
                return 'character-1';
              },
            },
            items: [
              {
                getName() {
                  return 'item-1';
                },
              },
            ],
          },
        ];
      },
    };
  });
}

const makeSut = () => {
  const countdown = new CountdownMock();
  const carousel = new Carousel(countdown);
  const deck = new DeckMock();
  const players = new GamePlayersListMock();

  return {
    carousel, countdown, players, deck,
  };
};

describe('Carousel', () => {
  describe('On start', () => {
    it('should start countdown', async () => {
      const {carousel, countdown, players, deck} = makeSut();
      await carousel.start(players, deck);

      expect(countdown.start).toBeCalled();
    });

    it('should call deck takeRandomCarousel', async () => {
      const {carousel, players, deck} = makeSut();
      await carousel.start(players, deck);

      expect(deck.takeRandomCarouselBoard).toBeCalled();
    });
  });
});
