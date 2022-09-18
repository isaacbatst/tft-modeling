import {DeckMock} from './DeckMock';
import {
  Game, IPlayersManager, IRoundsManager,
} from './Game';

class PlayersManagerMock implements IPlayersManager {
  setupPlayers = jest.fn();
  makeBattleCouples = jest.fn();
  validatePlayers = jest.fn();
  connectPlayer = jest.fn();
  disconnectPlayer = jest.fn();
  getPlayers = jest.fn();
  makeCarouselCouples = jest.fn();
  getById = jest.fn();
  refillToNextRound = jest.fn();
}

class RoundMomentsMock implements IRoundsManager {
  startMoments = jest.fn();
}

const makeSut = () => {
  const deck = new DeckMock();

  const playersList = new PlayersManagerMock();
  const roundMoments = new RoundMomentsMock();

  const game = new Game(deck, playersList, roundMoments);

  return {
    game, deck, playersList, roundMoments,
  };
};

describe('Game', () => {
  describe('On start', () => {
    it('should call playersList setup', () => {
      const {game, playersList} = makeSut();

      game.start('any-id');

      expect(playersList.setupPlayers).toBeCalled();
    });

    it('should call roundMoments start', async () => {
      const {game, roundMoments} = makeSut();
      await game.start('any-id');

      expect(roundMoments.startMoments).toBeCalled();
    });
  });
});
