import {DeckMock} from './DeckMock';
import {
  Game, IRoundsManager,
} from './Game';
import {GamePlayersListMock} from './GamePlayersListMock';


class RoundMomentsMock implements IRoundsManager {
  start = jest.fn();
}

const makeSut = () => {
  const deck = new DeckMock();

  const playersList = new GamePlayersListMock();
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
