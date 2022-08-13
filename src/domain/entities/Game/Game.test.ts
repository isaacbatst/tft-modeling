import {
  Game, GameDeck, IRoundsManager, IHand,
} from './Game';
import {GamePlayersListMock} from './GamePlayersListMock';

class DeckMock implements GameDeck {
  takeRandomHand = jest.fn((): IHand[] => {
    return [];
  });
}

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
    it('should call deck takeRandomHand for each player', () => {
      const {game, deck, playersList} = makeSut();

      game.start();

      expect(deck.takeRandomHand).toBeCalledTimes(playersList.getAll().length);
    });

    it('should call each player setHand with takeRandomHand return', () => {
      const {game, playersList} = makeSut();

      game.start();

      playersList.getAll().forEach((player) => {
        expect(player.setHand).toBeCalled();
      });
    });

    it('should call each player setGold with 3', () => {
      const {game, playersList} = makeSut();

      game.start();

      playersList.getAll().forEach((player) => {
        expect(player.setGold).toBeCalledWith(3);
      });
    });

    it('should call roundMoments start', async () => {
      const {game, roundMoments} = makeSut();
      await game.start();

      expect(roundMoments.start).toBeCalled();
    });
  });
});
