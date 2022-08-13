import {
  Game, GameDeck,
  IGameCountdown, IGamePlayer, IGamePlayersList, IHand,
} from './Game';

class DeckMock implements GameDeck {
  takeRandomHand = jest.fn((): IHand[] => {
    return [];
  });
}

class CountdownMock implements IGameCountdown {
  start = jest.fn();
  subscribe = jest.fn();
  unsubscribe = jest.fn();
}

class GamePlayersListMock implements IGamePlayersList {
  makeCouples = jest.fn((): [IGamePlayer, IGamePlayer][] => {
    return [];
  });

  getAll(): IGamePlayer[] {
    return [];
  }
}

const makeSut = () => {
  const deck = new DeckMock();

  const countdown = new CountdownMock();
  const playersList = new GamePlayersListMock();

  const game = new Game(deck, countdown, playersList);

  return {
    game, deck, countdown, playersList,
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

    it('should call countdown start with ROUND_PREPARATION_TIME', () => {
      const {game, countdown} = makeSut();
      game.start();

      expect(countdown.start).toHaveBeenCalledTimes(1);
      expect(countdown.start).toBeCalledWith(Game.ROUND_PREPARATION_TIME);
    });

    it('should call playersList makeCouples', async () => {
      const {game, playersList} = makeSut();
      await game.start();

      expect(playersList.makeCouples).toBeCalled();
    });

    it('should call countdown start with ROUND_BATTLE_TIME', async () => {
      const {game, countdown} = makeSut();
      await game.start();

      expect(countdown.start).toHaveBeenCalledTimes(2);
      expect(countdown.start).toBeCalledWith(Game.ROUND_BATTLE_TIME);
    });

    it('should call players refill functions after battle time', async () => {
      const {game, playersList} = makeSut();
      const promise = game.start();

      playersList.getAll().forEach((player) => {
        expect(player.incrementGold).not.toBeCalled();
        expect(player.setHand).toHaveBeenCalledTimes(1);
      });

      await promise;

      playersList.getAll().forEach((player) => {
        expect(player.incrementGold).toBeCalled();
        expect(player.setHand).toHaveBeenCalledTimes(2);
      });
    });
  });
});
