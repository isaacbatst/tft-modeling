import {CountdownMock} from './GameCountdownMock';
import {Carousel} from './Carousel';
import {GamePlayersListMock} from '../GamePlayersListMock';

jest.useFakeTimers();

const makeSut = () => {
  const countdown = new CountdownMock();
  const carousel = new Carousel(countdown);
  const players = new GamePlayersListMock();

  return {
    carousel, countdown, players,
  };
};

describe('Carousel', () => {
  describe('On start', () => {
    it('should start countdown', async () => {
      const {carousel, countdown, players} = makeSut();
      await carousel.start(players);

      expect(countdown.start).toBeCalled();
    });
  });
});
