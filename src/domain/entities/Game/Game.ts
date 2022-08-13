// import {Character, CharacterAttributes, Sinergy} from './Character';
// import {Item} from './Item';
import {GamePlayersList} from './GamePlayersList';

export enum GameErrors {
  BELLOW_MIN_PLAYERS = 'BELLOW_MIN_PLAYERS',
  REPEATED_PLAYER = 'REPEATED_PLAYER'
}

// interface Card {

// }

// class Hand {
//   private cards: Card[];

//   constructor(cards: Card[]) {
//     this.validateCards(cards);

//     this.cards = cards;
//   }

//   private validateCards(cards: Card[]) {
//     if (cards.length !== 5) {
//       throw new Error('INVALID_CARDS_QUANTITY');
//     }
//   }
// }

export interface IHand {}

export interface GameDeck {
  takeRandomHand(): IHand[]
}

export interface IGamePlayer {
  getId(): string
  getGold(): number
  setGold(value: number): void
  setHand(characters: IHand[]): void
}

export interface IGameCountdown {
  subscribe(callback: (time: number) => void): number;
  unsubscribe(index: number): void;
  start(): Promise<void>;
}

export class Game {
  static INITIAL_GOLD = 3;
  static ROUND_TIME = 3;
  static GOLD_PER_ROUND = 5;

  private players: GamePlayersList;
  private deck: GameDeck;
  private stage: number;
  private round: number;
  private countdown: IGameCountdown;

  constructor(
      players: IGamePlayer[],
      deck: GameDeck,
      countdown: IGameCountdown,
  ) {
    this.stage = 1;
    this.round = 1;
    this.deck = deck;
    this.countdown = countdown;
    this.players = new GamePlayersList(players);
  }

  public start() {
    this.setupPlayers();
    this.startRounds();
  }


  private setupPlayers() {
    this.players.getAll().forEach((player) => {
      const hand = this.deck.takeRandomHand();

      player.setHand(hand);
      player.setGold(Game.INITIAL_GOLD);
    });
  }

  private async startRounds() {
    this.countdown.subscribe((time) => console.log(time));

    while (true) {
      await this.countdown.start();
      console.log(this.players);
      this.refillPlayers();
    }
  }

  private refillPlayers() {
    this.players.getAll().forEach((player) => {
      const gold = player.getGold();
      player.setGold(gold + Game.GOLD_PER_ROUND);

      const hand = this.deck.takeRandomHand();
      player.setHand(hand);
    });
  }
}
