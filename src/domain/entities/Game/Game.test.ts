import {Game, GameDeck, GameErrors, ICharacter, IGamePlayer} from './Game';

class DeckMock implements GameDeck {
  takeRandomHand = jest.fn((): ICharacter[] => {
    return [];
  });
}

class PlayerMock implements IGamePlayer {
  constructor(private id: string) {}

  getId(): string {
    return this.id;
  }

  setHand = jest.fn();
  setGold = jest.fn();
}

const makeSut = () => {
  const player1 = new PlayerMock('any-id-1');
  const player2 = new PlayerMock('any-id-2');
  const deck = new DeckMock();

  const players = [player1, player2];

  const game = new Game(players, deck);

  return {
    game, deck, players,
  };
};

describe('Game', () => {
  describe('Given 0 player is passed', () => {
    it('should throw BELLOW_MIN_PLAYERS error', () => {
      const players: PlayerMock[] = [];
      const deck = new DeckMock();

      expect(() => {
        new Game(players, deck);
      }).toThrow(GameErrors.BELLOW_MIN_PLAYERS);
    });
  });

  describe('Given 1 player is passed', () => {
    it('should throw BELLOW_MIN_PLAYERS error', () => {
      const player: PlayerMock = new PlayerMock('any-id');
      const players = [player];
      const deck = new DeckMock();

      expect(() => {
        new Game(players, deck);
      }).toThrow(GameErrors.BELLOW_MIN_PLAYERS);
    });
  });

  describe('Given repeated ids', () => {
    it('should throw REPEATED_PLAYER error', () => {
      const player = new PlayerMock('any-id-1');
      const player2 = new PlayerMock('any-id-1');

      const players = [player, player2];
      const deck = new DeckMock();

      expect(() => {
        new Game(players, deck);
      }).toThrow(GameErrors.REPEATED_PLAYER);
    });
  });


  describe('Given 2 different players are passed', () => {
    it('should NOT throw BELLOW_MIN_PLAYERS error', () => {
      const player1 = new PlayerMock('any-id-1');
      const player2 = new PlayerMock('any-id-2');
      const deck = new DeckMock();

      const players = [player1, player2];

      expect(() => {
        new Game(players, deck);
      }).not.toThrow(GameErrors.BELLOW_MIN_PLAYERS);
    });
  });

  describe('On start', () => {
    it('should call deck takeRandomHand for each player', () => {
      const {game, deck, players} = makeSut();

      game.start();

      expect(deck.takeRandomHand).toBeCalledTimes(players.length);
    });

    it('should call each player setHand with takeRandomHand return', () => {
      const {game, players} = makeSut();

      game.start();

      players.forEach((player) => {
        expect(player.setHand).toBeCalled();
      });
    });

    it('should call each player setGold with 3', () => {
      const {game, players} = makeSut();

      game.start();

      players.forEach((player) => {
        expect(player.setGold).toBeCalledWith(3);
      });
    });
  });
});
