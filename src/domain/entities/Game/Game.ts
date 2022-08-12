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

export interface ICharacter {}

export interface GameDeck {
  takeRandomHand(): ICharacter[]
}

export interface IGamePlayer {
  getId(): string
  setHand(characters: ICharacter[]): void
}

export class Game {
  private players: IGamePlayer[];
  private deck: GameDeck;

  constructor(players: IGamePlayer[], deck: GameDeck) {
    this.validatePlayers(players);

    this.deck = deck;
    this.players = players;
  }

  public start() {
    this.givePlayersFirstHand();
  }

  private givePlayersFirstHand() {
    this.players.forEach((player) => {
      const hand = this.deck.takeRandomHand();

      player.setHand(hand);
    });
  }

  private validatePlayers(players: IGamePlayer[]) {
    if (players.length < 2) {
      throw new Error(GameErrors.BELLOW_MIN_PLAYERS);
    }

    const hasRepeatedId = players
        .some((iPlayer, index) => {
          const foundIndex = players
              .findIndex((jPlayer) => jPlayer.getId() === iPlayer.getId());
          return foundIndex !== index;
        });

    if (hasRepeatedId) {
      throw new Error(GameErrors.REPEATED_PLAYER);
    }
  }
}
