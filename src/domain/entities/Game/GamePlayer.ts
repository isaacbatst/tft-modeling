import {IHand} from './Game';
import {IGamePlayer} from './PlayersManager/PlayersList';

export class GamePlayer implements IGamePlayer {
  private id: string;
  private life: number;
  private gold: number;
  private hand: IHand[];
  private connected: boolean;
  private owner: boolean;

  constructor(id: string, owner: boolean = false) {
    this.id = id;
    this.life = 100;
    this.gold = 0;
    this.hand = [];
    this.connected = true;
    this.owner = owner;
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

  getIsOwner(): boolean {
    return this.owner;
  }

  setConnected(connected: boolean): void {
    this.connected = connected;
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
