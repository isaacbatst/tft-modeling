import {IGamePlayer, IHand} from './Game';

export class GamePlayer implements IGamePlayer {
  private id: string;
  private life: number;
  private gold: number;
  private hand: IHand[];
  private connected: boolean;

  constructor(id: string) {
    this.id = id;
    this.life = 100;
    this.gold = 0;
    this.hand = [];
    this.connected = true;
  }

  getId(): string {
    return this.id;
  }
  getLife(): number {
    return this.life;
  }
  getGold(): number {
    return this.gold;
  }

  getConnected(): boolean {
    return this.connected;
  }

  decrementLife(value: number): void {
    this.life -= value;
  }
  incrementGold(value: number): void {
    this.gold += value;
  }
  setGold(value: number): void {
    this.gold = value;
  }
  setHand(characters: IHand[]): void {
    this.hand = characters;
  }
}
