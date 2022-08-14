import {GamePlayerMock} from './GamePlayerMock';
import {
  GamePlayersList,
  GamePlayersListErrors, PlayersListEventDispatcher,
} from './GamePlayersList';

class DispatchMock implements PlayersListEventDispatcher {
  playerAdded = jest.fn();
  playerDisconnected = jest.fn();
}

describe('GamePlayersList', () => {
  describe('Given 0 player is passed', () => {
    it('should throw BELLOW_MIN_PLAYERS error', () => {
      const dispatch = new DispatchMock();
      expect(() => {
        new GamePlayersList([], dispatch);
      }).toThrow(GamePlayersListErrors.BELLOW_MIN_PLAYERS);
    });
  });

  describe('Given 1 player is passed', () => {
    it('should throw BELLOW_MIN_PLAYERS error', () => {
      const player1 = new GamePlayerMock('any-id-1');
      const dispatch = new DispatchMock();

      expect(() => {
        new GamePlayersList([player1], dispatch);
      }).toThrow(GamePlayersListErrors.BELLOW_MIN_PLAYERS);
    });
  });

  describe('Given repeated ids', () => {
    it('should throw REPEATED_PLAYER error', () => {
      const player1 = new GamePlayerMock('any-id-1');
      const player2 = new GamePlayerMock('any-id-1');
      const dispatch = new DispatchMock();

      expect(() => {
        new GamePlayersList([player1, player2], dispatch);
      }).toThrow(GamePlayersListErrors.REPEATED_PLAYER);
    });
  });


  describe('Given 2 different players are passed', () => {
    it('should NOT throw BELLOW_MIN_PLAYERS error', () => {
      const player1 = new GamePlayerMock('any-id-1');
      const player2 = new GamePlayerMock('any-id-2');
      const dispatch = new DispatchMock();

      expect(() => {
        new GamePlayersList([player1, player2], dispatch);
      }).not.toThrow(GamePlayersListErrors.BELLOW_MIN_PLAYERS);
    });
  });
});
