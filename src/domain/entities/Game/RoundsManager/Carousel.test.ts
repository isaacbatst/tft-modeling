import {PlayerCoupleDTO} from '../PlayersManager/PlayersList';
import {
  Carousel, CarouselEventsDispatchers, CarouselPlayerManager, DeckForCarousel,
} from './Carousel';
import {CountdownMock} from './GameCountdownMock';

class DeckMock implements DeckForCarousel {
  takeRandomCarouselBoard = jest.fn();
}

class DispatchMock implements CarouselEventsDispatchers {
  carouselStart = jest.fn();
  carouselEnd = jest.fn();
  releasePlayers = jest.fn();
  releaseCountdown = jest.fn();
  releaseCountdownChange = jest.fn();
}

class PlayersManagerMock implements CarouselPlayerManager {
  player1 = {
    id: 'any-string',
    life: 100,
    gold: 100,
    connected: true,
    isOwner: true,
  };

  player2 = {
    id: 'any-string',
    life: 100,
    gold: 100,
    connected: true,
    isOwner: false,
  };

  couple: PlayerCoupleDTO = [this.player1, this.player2];

  makeCarouselCouples = jest.fn(() => [this.couple]);
}

const makeSut = () => {
  const momentCountdown = new CountdownMock();
  const playersCountdown = new CountdownMock();
  const dispatch = new DispatchMock();
  const carousel = new Carousel(momentCountdown, playersCountdown, dispatch);
  const deck = new DeckMock();
  const playersManager = new PlayersManagerMock();

  return {
    carousel,
    momentCountdown,
    playersCountdown,
    players: playersManager,
    deck,
    dispatch,
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

      expect(dispatch.carouselStart).toBeCalled();
    });

    it('should not dispatch end event', async () => {
      const {carousel, players, dispatch, deck} = makeSut();

      carousel.start(players, deck);

      expect(dispatch.carouselEnd).not.toBeCalled();
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

        expect(dispatch.carouselEnd).toBeCalled();
      });
    });
  });
});
