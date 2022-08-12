import {Game, GameErrors, IPlayer} from './Game';

describe('Game', () => {
  describe('Given 0 player is passed', () => {
    it('should throw BELLOW_MIN_PLAYERS error', () => {
      const players: IPlayer[] = [];

      expect(() => {
        new Game(players);
      }).toThrow(GameErrors.BELLOW_MIN_PLAYERS);
    });
  });

  describe('Given 1 player is passed', () => {
    it('should throw BELLOW_MIN_PLAYERS error', () => {
      const player: IPlayer = {id: 'any-id-1', name: 'player'};
      const players: IPlayer[] = [player];

      expect(() => {
        new Game(players);
      }).toThrow(GameErrors.BELLOW_MIN_PLAYERS);
    });
  });

  describe('Given 2 players are passed', () => {
    it('should NOT throw BELLOW_MIN_PLAYERS error', () => {
      const player1: IPlayer = {id: 'any-id-1', name: 'player-1'};
      const player2: IPlayer = {id: 'any-id-2', name: 'player-2'};

      const players: IPlayer[] = [player1, player2];

      expect(() => {
        new Game(players);
      }).not.toThrow(GameErrors.BELLOW_MIN_PLAYERS);
    });
  });

  describe('Given repeated ids', () => {
    it('should throw REPEATED_PLAYER error', () => {
      const player: IPlayer = {id: 'any-id', name: 'player'};
      const players = [player, player];

      expect(() => {
        new Game(players);
      }).toThrow(GameErrors.REPEATED_PLAYER);
    });
  });
});
