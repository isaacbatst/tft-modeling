// import {Character, CharacterAttributes, Sinergy} from './Character';
// import {Item} from './Item';
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
  getLife(): number
  decrementLife(value: number): void
  incrementGold(value: number): void
  setGold(value: number): void
  setHand(characters: IHand[]): void
}

export interface IGameCountdown {
  subscribe(callback: (time: number) => void): number;
  unsubscribe(index: number): void;
  start(roundTime: number): Promise<void>;
}

export interface IGamePlayersList {
  getAll(): IGamePlayer[];
  makeCouples(): [IGamePlayer, IGamePlayer][]
}

export interface IGameRoundMoments {
  start(players: IGamePlayersList): Promise<void>
}

export class Game {
  static INITIAL_GOLD = 3;
  static ROUND_PREPARATION_TIME = 3;
  static ROUND_BATTLE_TIME = 5;
  static GOLD_PER_ROUND = 5;

  private players: IGamePlayersList;
  private deck: GameDeck;
  private stage: number;
  private round: number;
  private countdown: IGameCountdown;
  private roundMoments: IGameRoundMoments;

  constructor(
      deck: GameDeck,
      countdown: IGameCountdown,
      playersList: IGamePlayersList,
      roundMoments: IGameRoundMoments,
  ) {
    this.stage = 1;
    this.round = 1;
    this.deck = deck;
    this.countdown = countdown;
    this.players = playersList;
    this.roundMoments = roundMoments;
  }

  public start() {
    this.setupPlayers();
    return this.startRounds();
  }


  private setupPlayers() {
    this.players.getAll().forEach((player) => {
      const hand = this.deck.takeRandomHand();

      player.setHand(hand);
      player.setGold(Game.INITIAL_GOLD);
    });
  }

  private async startRounds() {
    const shouldContinue = true;

    while (shouldContinue) {
      await this.roundMoments.start(this.players);

      if (this.checkIfShouldStop()) {
        break;
      }

      this.refillPlayers();
    }

    return this.players.getAll();
  }

  private checkIfShouldStop(): boolean {
    const players = this.players.getAll();
    const remainingPlayers = players.filter((player) => player.getLife() > 0);
    return remainingPlayers.length < 2;
  }

  private refillPlayers() {
    this.players.getAll().forEach((player) => {
      player.incrementGold(Game.GOLD_PER_ROUND);

      const hand = this.deck.takeRandomHand();
      player.setHand(hand);
    });
  }
}
