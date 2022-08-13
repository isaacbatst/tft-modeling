import {IGamePlayer} from './Game';
import {GamePlayersList, GamePlayersListErrors} from './GamePlayersList';

class PlayerMock implements IGamePlayer {
  constructor(private id: string) {}

  getId(): string {
    return this.id;
  }

  setHand = jest.fn();
  setGold = jest.fn();
  incrementGold = jest.fn();
}

describe('Given 0 player is passed', () => {
  it('should throw BELLOW_MIN_PLAYERS error', () => {
    expect(() => {
      new GamePlayersList([]);
    }).toThrow(GamePlayersListErrors.BELLOW_MIN_PLAYERS);
  });
});

describe('Given 1 player is passed', () => {
  it('should throw BELLOW_MIN_PLAYERS error', () => {
    const player1 = new PlayerMock('any-id-1');

    expect(() => {
      new GamePlayersList([player1]);
    }).toThrow(GamePlayersListErrors.BELLOW_MIN_PLAYERS);
  });
});

describe('Given repeated ids', () => {
  it('should throw REPEATED_PLAYER error', () => {
    const player1 = new PlayerMock('any-id-1');
    const player2 = new PlayerMock('any-id-1');

    expect(() => {
      new GamePlayersList([player1, player2]);
    }).toThrow(GamePlayersListErrors.REPEATED_PLAYER);
  });
});


describe('Given 2 different players are passed', () => {
  it('should NOT throw BELLOW_MIN_PLAYERS error', () => {
    const player1 = new PlayerMock('any-id-1');
    const player2 = new PlayerMock('any-id-2');

    expect(() => {
      new GamePlayersList([player1, player2]);
    }).not.toThrow(GamePlayersListErrors.BELLOW_MIN_PLAYERS);
  });
});
