import {DeckMock} from './DeckMock';
import {
  Game, IPlayersManager, IRoundsManager,
} from './Game';

class PlayersManagerMock implements IPlayersManager {
  setupPlayers = jest.fn();
  makeBattleCouples = jest.fn();
  validatePlayers = jest.fn();
  addPlayer = jest.fn();
  disconnectPlayer = jest.fn();
  getPlayersList = jest.fn();
  makeCarouselCouples = jest.fn();
}

class RoundMomentsMock implements IRoundsManager {
  start = jest.fn();
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

      game.start();

      expect(playersList.setupPlayers).toBeCalled();
    });

    it('should call roundMoments start', async () => {
      const {game, roundMoments} = makeSut();
      await game.start();

      expect(roundMoments.start).toBeCalled();
    });
  });
});
