import {
  Game, GameDeck, IGamePlayersList, IGameRoundMoment, IHand,
} from './Game';
import {GamePlayerMock} from './GamePlayerMock';
import {GamePlayersListMock} from './GamePlayersListMock';

class DeckMock implements GameDeck {
  takeRandomHand = jest.fn((): IHand[] => {
    return [];
  });
}

class RoundMomentsMock implements IGameRoundMoment {
  start = jest.fn();

  killPlayerOnFirstRound = async (players: IGamePlayersList) => {
    const [firstPlayer] = players.getAll();
    firstPlayer.decrementLife(GamePlayerMock.INITIAL_LIFE);
  };

  killPlayerOnSecondRound = async (players: IGamePlayersList) => {
    const [firstPlayer] = players.getAll();
    firstPlayer.decrementLife(GamePlayerMock.INITIAL_LIFE / 2);
  };
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

    describe('Given player 1 dies on first round', () => {
      it('should call round start only once', async () => {
        const {game, roundMoments} = makeSut();
        roundMoments.start
            .mockImplementation(roundMoments.killPlayerOnFirstRound);


        await game.start();

        expect(roundMoments.start).toHaveBeenCalledTimes(1);
      });

      it('should not call players incrementGold', async () => {
        const {game, roundMoments, playersList} = makeSut();
        roundMoments.start
            .mockImplementation(roundMoments.killPlayerOnFirstRound);


        await game.start();

        playersList.getAll().forEach((player) => {
          expect(player.incrementGold).not.toBeCalled();
        });
      });

      it('should call players setHand once', async () => {
        const {game, roundMoments, playersList} = makeSut();
        roundMoments.start
            .mockImplementation(roundMoments.killPlayerOnFirstRound);

        await game.start();

        playersList.getAll().forEach((player) => {
          expect(player.setHand).toHaveBeenCalledTimes(1);
        });
      });

      it('should return on stage 1', async () => {
        const {game, roundMoments} = makeSut();
        roundMoments.start
            .mockImplementation(roundMoments.killPlayerOnFirstRound);

        const {stage} = await game.start();

        expect(stage).toBe(1);
      });

      it('should return on round 1', async () => {
        const {game, roundMoments} = makeSut();
        roundMoments.start
            .mockImplementation(roundMoments.killPlayerOnFirstRound);

        const {round} = await game.start();

        expect(round).toBe(1);
      });
    });

    describe('Given player 1 dies on second round', () => {
      it('should call round start twice', async () => {
        const {game, roundMoments} = makeSut();
        roundMoments.start
            .mockImplementation(roundMoments.killPlayerOnSecondRound);

        await game.start();

        expect(roundMoments.start).toHaveBeenCalledTimes(2);
      });

      it('should call players incrementGold once', async () => {
        const {game, roundMoments, playersList} = makeSut();
        roundMoments.start
            .mockImplementation(roundMoments.killPlayerOnSecondRound);

        await game.start();

        playersList.getAll().forEach((player) => {
          expect(player.incrementGold).toHaveBeenCalledTimes(1);
        });
      });

      it('should call players setHand twice', async () => {
        const {game, roundMoments, playersList} = makeSut();
        roundMoments.start
            .mockImplementation(roundMoments.killPlayerOnSecondRound);

        await game.start();

        playersList.getAll().forEach((player) => {
          expect(player.setHand).toHaveBeenCalledTimes(2);
        });
      });

      it('should return on stage 1', async () => {
        const {game, roundMoments} = makeSut();
        roundMoments.start
            .mockImplementation(roundMoments.killPlayerOnSecondRound);

        const {stage} = await game.start();

        expect(stage).toBe(1);
      });

      it('should return on round 2', async () => {
        const {game, roundMoments} = makeSut();
        roundMoments.start
            .mockImplementation(roundMoments.killPlayerOnSecondRound);

        const {round} = await game.start();

        expect(round).toBe(2);
      });
    });
  });
});
