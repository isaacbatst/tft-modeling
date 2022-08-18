// import {Character, CharacterAttributes, Sinergy} from './Character';
// import {Item} from './Item';

import {PlayerCoupleDTO} from './PlayersManager/PlayersList';
import {
  DeckForCarousel,
  CarouselPlayerManager,
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

export interface IPlayersManager extends CarouselPlayerManager {
  makeBattleCouples(): PlayerCoupleDTO[]
  validatePlayers(): void;
  addPlayer(id: string): void;
  disconnectPlayer(id: string): void
  getPlayersList(): GamePlayerDTO[];
  getById(id: string): GamePlayerDTO | null;
  setupPlayers(setup: {
    gold: number,
    getHand: () => IHand,
  }): void
}

export interface IRoundsManager {
  start(
    players: IPlayersManager,
    goldPerRound: number,
    deck: IGameDeck
  ): Promise<void>,
}

export interface GamePlayerDTO {
  id: string,
  life: number,
  gold: number,
  connected: boolean,
  isOwner: boolean
}

enum GameStartErrors {
  PLAYER_NOT_FOUND = 'PLAYER_NOT_FOUND',
  PLAYER_IS_NOT_LOBBY_OWNER = 'PLAYER_IS_NOT_LOBBY_OWNER'
}

export class Game {
  private static INITIAL_GOLD = 3;
  private static GOLD_PER_ROUND = 5;

  constructor(
      private deck: IGameDeck,
      private players: IPlayersManager,
      private roundsManager: IRoundsManager,
  ) {}

  public handlePlayerConnected(id: string) {
    this.players.addPlayer(id);
  }

  public handlePlayerDisconnected(id: string) {
    this.players.disconnectPlayer(id);
  }

  public async start(id: string) {
    const player = this.players.getById(id);

    if (!player) {
      throw new Error(GameStartErrors.PLAYER_NOT_FOUND);
    }

    if (!player.isOwner) {
      throw new Error(GameStartErrors.PLAYER_IS_NOT_LOBBY_OWNER);
    }

    this.players.validatePlayers();
    this.setupPlayers();

    await this.roundsManager
        .start(this.players, Game.GOLD_PER_ROUND, this.deck);

    return {
      players: this.players.getPlayersList(),
    };
  }

  public getPlayers() {
    return this.players.getPlayersList();
  }

  private setupPlayers() {
    this.players.setupPlayers({
      gold: Game.INITIAL_GOLD,
      getHand: () => this.deck.takeRandomHand(),
    });
  }
}
