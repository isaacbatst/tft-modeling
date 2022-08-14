// import {Character, CharacterAttributes, Sinergy} from './Character';
// import {Item} from './Item';

import {PlayerCoupleDTO} from './GamePlayersList';
import {
  DeckForCarousel,
  PlayersListForCarousel,
} from './RoundsManager/Carousel';

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
export interface IGameDeck extends DeckForCarousel {
  takeRandomHand(): IHand[];
}

export interface IGamePlayersList extends PlayersListForCarousel {
  makeBattleCouples(): PlayerCoupleDTO[]
  validatePlayers(): void;
  addPlayer(id: string): void;
  disconnectPlayer(id: string): void
  getDTOList(): GamePlayerDTO[];
  setupPlayers(setup: {
    gold: number,
    getRandomHand: () => IHand,
  }): void
}

export interface IRoundsManager {
  start(
    players: IGamePlayersList,
    goldPerRound: number,
    deck: IGameDeck
  ): Promise<void>,
}

export interface GamePlayerDTO {
  id: string,
  life: number,
  gold: number,
  connected: boolean,
}

export class Game {
  private static INITIAL_GOLD = 3;
  private static GOLD_PER_ROUND = 5;

  constructor(
      private deck: IGameDeck,
      private players: IGamePlayersList,
      private roundsManager: IRoundsManager,
  ) {}

  public handlePlayerConnected(id: string) {
    this.players.addPlayer(id);
  }

  public handlePlayerDisconnected(id: string) {
    this.players.disconnectPlayer(id);
  }

  public async start() {
    this.players.validatePlayers();
    this.setupPlayers();

    await this.roundsManager
        .start(this.players, Game.GOLD_PER_ROUND, this.deck);

    return {
      players: this.players.getDTOList(),
    };
  }

  public getPlayers() {
    return this.players.getDTOList();
  }

  private setupPlayers() {
    this.players.setupPlayers({
      gold: Game.INITIAL_GOLD,
      getRandomHand: () => this.deck.takeRandomHand(),
    });
  }
}
