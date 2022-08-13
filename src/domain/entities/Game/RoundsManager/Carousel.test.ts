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
  releasePlayers = jest.fn();
}

const makeSut = () => {
  const momentCountdown = new CountdownMock();
  const playersCountdown = new CountdownMock();
  const dispatch = new DispatchMock();
  const carousel = new Carousel(momentCountdown, playersCountdown, dispatch);
  const deck = new DeckMock();
  const players = new GamePlayersListMock();

  return {
    carousel, momentCountdown, playersCountdown, players, deck, dispatch,
  };
};

describe('Carousel', () => {
  describe('On start', () => {
    it('should start countdown', async () => {
      const {carousel, momentCountdown: countdown, players, deck} = makeSut();
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

    it('should dispatch release player event once', async () => {
      const {carousel, players, dispatch, deck} = makeSut();

      carousel.start(players, deck);

      expect(dispatch.releasePlayers).toHaveBeenCalledTimes(1);
    });

    it('should start player countdown once', async () => {
      const {carousel, players, deck, playersCountdown} = makeSut();

      carousel.start(players, deck);

      expect(playersCountdown.start).toHaveBeenCalledTimes(1);
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
