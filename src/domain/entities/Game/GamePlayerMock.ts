import {IGamePlayer} from './Game';

export class GamePlayerMock implements IGamePlayer {
  static INITIAL_LIFE = 100;

  constructor(private id: string) {}

  getId(): string {
    return this.id;
  }

  private life = GamePlayerMock.INITIAL_LIFE;

  setHand = jest.fn();
  setGold = jest.fn();
  getGold = jest.fn();
  incrementGold = jest.fn();
  getLife = jest.fn(() => this.life);
  decrementLife = jest.fn((value: number) => this.life -= value);
}
