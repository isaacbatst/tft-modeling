// import {Character, CharacterAttributes, Sinergy} from './Character';
// import {Item} from './Item';

import {GameCountdown} from './GameCountdown';
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

export interface ICharacter {}

export interface GameDeck {
  takeRandomHand(): ICharacter[]
}

export interface IGamePlayer {
  getId(): string
  setGold(value: number): void
  setHand(characters: ICharacter[]): void
}

export class Game {
  static INITIAL_GOLD = 3;
  static ROUND_TIME = 15;

  private players: GamePlayersList;
  private deck: GameDeck;
  private stage: number;
  private round: number;
  private countdown: GameCountdown;

  constructor(players: IGamePlayer[], deck: GameDeck) {
    this.stage = 1;
    this.round = 1;
    this.deck = deck;
    this.countdown = new GameCountdown(Game.ROUND_TIME);
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
    this.countdown.subscribeCountdown((time) => console.log(time));

    while (true) {
      await this.countdown.startRound();
    }
  }
}
