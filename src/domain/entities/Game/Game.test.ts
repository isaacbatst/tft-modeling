import {
  Game, GameDeck,
  IGameCountdown, IGamePlayer, IGamePlayersList, IHand, IRoundMoments,
} from './Game';
import {GamePlayerMock} from './GamePlayerMock';

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
  private players: IGamePlayer[] = [
    new GamePlayerMock('any-id-1'),
    new GamePlayerMock('any-id-2'),
  ];

  makeCouples = jest.fn((): [IGamePlayer, IGamePlayer][] => {
    return [];
  });

  getAll(): IGamePlayer[] {
    return this.players;
  }
}

class RoundMomentsMock implements IRoundMoments {
  start = jest.fn();
}

const makeSut = () => {
  const deck = new DeckMock();

  const countdown = new CountdownMock();
  const playersList = new GamePlayersListMock();
  const roundMoments = new RoundMomentsMock();

  const game = new Game(deck, countdown, playersList, roundMoments);

  return {
    game, deck, countdown, playersList, roundMoments,
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

    describe('Given player 1 dies on first round', () => {
      it('should call round start only once', async () => {
        const {game, roundMoments} = makeSut();
        roundMoments.start
            .mockImplementation(async (players: IGamePlayersList) => {
              const [firstPlayer] = players.getAll();
              firstPlayer.decrementLife(GamePlayerMock.INITIAL_LIFE);
            });

        await game.start();

        expect(roundMoments.start).toHaveBeenCalledTimes(1);
      });

      it('should not call players incrementGold', async () => {
        const {game, roundMoments, playersList} = makeSut();
        roundMoments.start
            .mockImplementation(async (players: IGamePlayersList) => {
              const [firstPlayer] = players.getAll();
              firstPlayer.decrementLife(GamePlayerMock.INITIAL_LIFE);
            });

        await game.start();

        playersList.getAll().forEach((player) => {
          expect(player.incrementGold).not.toBeCalled();
        });
      });

      it('should call players setHand once', async () => {
        const {game, roundMoments, playersList} = makeSut();
        roundMoments.start
            .mockImplementation(async (players: IGamePlayersList) => {
              const [firstPlayer] = players.getAll();
              firstPlayer.decrementLife(GamePlayerMock.INITIAL_LIFE);
            });

        await game.start();

        playersList.getAll().forEach((player) => {
          expect(player.setHand).toHaveBeenCalledTimes(1);
        });
      });
    });

    describe('Given player 1 dies on second round', () => {
      it('should call round start twice', async () => {
        const {game, roundMoments} = makeSut();
        roundMoments.start
            .mockImplementation(async (players: IGamePlayersList) => {
              const [firstPlayer] = players.getAll();
              firstPlayer.decrementLife(GamePlayerMock.INITIAL_LIFE / 2);
            });

        await game.start();

        expect(roundMoments.start).toHaveBeenCalledTimes(2);
      });

      it('should call players incrementGold once', async () => {
        const {game, roundMoments, playersList} = makeSut();
        roundMoments.start
            .mockImplementation(async (players: IGamePlayersList) => {
              const [firstPlayer] = players.getAll();
              firstPlayer.decrementLife(GamePlayerMock.INITIAL_LIFE / 2);
            });

        await game.start();

        playersList.getAll().forEach((player) => {
          expect(player.incrementGold).toHaveBeenCalledTimes(1);
        });
      });

      it('should call players setHand twice', async () => {
        const {game, roundMoments, playersList} = makeSut();
        roundMoments.start
            .mockImplementation(async (players: IGamePlayersList) => {
              const [firstPlayer] = players.getAll();
              firstPlayer.decrementLife(GamePlayerMock.INITIAL_LIFE / 2);
            });

        await game.start();

        playersList.getAll().forEach((player) => {
          expect(player.setHand).toHaveBeenCalledTimes(2);
        });
      });
    });
  });
});
