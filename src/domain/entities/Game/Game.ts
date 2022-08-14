// import {Character, CharacterAttributes, Sinergy} from './Character';
// import {Item} from './Item';

import {GamePlayer} from './GamePlayer';
import {DeckForCarousel,
  PlayersListForCarousel} from './RoundsManager/Carousel';

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

export interface IGamePlayer {
  getId(): string
  getLife(): number
  getGold(): number
  decrementLife(value: number): void
  incrementGold(value: number): void
  setGold(value: number): void
  setHand(characters: IHand[]): void
}

export type PlayerCouple = [IGamePlayer, IGamePlayer];

export interface IGamePlayersList extends PlayersListForCarousel {
  getAll(): IGamePlayer[];
  makeBattleCouples(): PlayerCouple[]
  validatePlayers(): void;
  addPlayer(player: IGamePlayer): void;
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
    const sameId = this.players.getAll().find((player) => {
      return player.getId() === id;
    });

    if (!sameId) {
      const player = new GamePlayer(id);
      this.players.addPlayer(player);
    }
  }

  private toDTO(player: IGamePlayer): GamePlayerDTO {
    return {
      gold: player.getGold(),
      id: player.getId(),
      life: player.getLife(),
    };
  }

  public async start() {
    this.players.validatePlayers();
    this.setupPlayers();

    await this.roundsManager
        .start(this.players, Game.GOLD_PER_ROUND, this.deck);

    return {
      players: this.players.getAll(),
    };
  }

  public getPlayers() {
    return this.players.getAll().map(this.toDTO);
  }

  private setupPlayers() {
    this.players.getAll().forEach((player) => {
      const hand = this.deck.takeRandomHand();

      player.setHand(hand);
      player.setGold(Game.INITIAL_GOLD);
    });
  }
}
