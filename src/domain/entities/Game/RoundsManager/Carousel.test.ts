import {CountdownMock} from './GameCountdownMock';
import {
  Carousel,
  CarouselBoard,
  CarouselEventsDispatchers,
  DeckForCarousel, ICharacterInGame} from './Carousel';
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

class DispatchMock implements CarouselEventsDispatchers {
  start: (board: CarouselBoard) => void = jest.fn();
  end = jest.fn();
}

const makeSut = () => {
  const countdown = new CountdownMock();
  const dispatch = new DispatchMock();
  const carousel = new Carousel(countdown, dispatch);
  const deck = new DeckMock();
  const players = new GamePlayersListMock();

  return {
    carousel, countdown, players, deck, dispatch,
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

    it('should dispatch start event', async () => {
      const {carousel, players, dispatch, deck} = makeSut();
      carousel.start(players, deck);

      expect(dispatch.start).toBeCalled();
    });

    it('should not dispatch end event', async () => {
      const {carousel, players, dispatch, deck} = makeSut();

      carousel.start(players, deck);

      expect(dispatch.end).not.toBeCalled();
    });

    describe('At the end', () => {
      it('should dispatch end event', async () => {
        const {carousel, players, dispatch, deck} = makeSut();

        await carousel.start(players, deck);

        expect(dispatch.end).toBeCalled();
      });
    });
  });
});
