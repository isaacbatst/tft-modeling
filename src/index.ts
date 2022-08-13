import {Game
  , GameDeck, IGamePlayer} from './domain/entities/Game/Game';

class DeckMock implements GameDeck {
  takeRandomHand = () => [];
}

class PlayerMock implements IGamePlayer {
  constructor(private id: string) {}

  getId(): string {
    return this.id;
  }

  setHand = () => {};
  setGold = () => {};
  getGold = () => 10;
}

const player1 = new PlayerMock('any-id-1');
const player2 = new PlayerMock('any-id-2');
const deck = new DeckMock();

const players = [player1, player2];

const game = new Game(players, deck);

game.start();
