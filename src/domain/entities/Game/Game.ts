// import {Character, CharacterAttributes, Sinergy} from './Character';
// import {Item} from './Item';

import {DeckForCarousel} from './RoundsManager/Carousel';

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
export interface GameDeck extends DeckForCarousel {
  takeRandomHand(): IHand[];
}

export interface IGamePlayer {
  getId(): string
  getLife(): number
  decrementLife(value: number): void
  incrementGold(value: number): void
  setGold(value: number): void
  setHand(characters: IHand[]): void
}

export interface IGamePlayersList {
  getAll(): IGamePlayer[];
  makeCouples(): [IGamePlayer, IGamePlayer][]
}

export interface IRoundsManager {
  start(
    players: IGamePlayersList,
    goldPerRound: number,
    deck: GameDeck
  ): Promise<void>,
}

export class Game {
  static INITIAL_GOLD = 3;
  static ROUND_PREPARATION_TIME = 3;
  static ROUND_BATTLE_TIME = 5;
  static GOLD_PER_ROUND = 5;

  constructor(
      private deck: GameDeck,
      private players: IGamePlayersList,
      private roundsManager: IRoundsManager,
  ) {
  }

  public async start() {
    this.setupPlayers();

    await this.roundsManager
        .start(this.players, Game.GOLD_PER_ROUND, this.deck);

    return {
      players: this.players.getAll(),
    };
  }


  private setupPlayers() {
    this.players.getAll().forEach((player) => {
      const hand = this.deck.takeRandomHand();

      player.setHand(hand);
      player.setGold(Game.INITIAL_GOLD);
    });
  }
}
