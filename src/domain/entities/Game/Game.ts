// import {Character, CharacterAttributes, Sinergy} from './Character';
// import {Item} from './Item';

import {
  CarouselStartPlayerManager, DeckForCarousel,
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

export interface IPlayersManager extends CarouselStartPlayerManager {
  validatePlayers(): void;
  connectPlayer(id: string): void;
  disconnectPlayer(id: string): void
  getPlayers(): GamePlayerDTO[];
  getById(id: string): GamePlayerDTO | null;
  setupPlayers(setup: {
    gold: number,
  }): void;
  refillToNextRound(
    baseGold: number,
    getHand: () => IHand
  ): void;
}

export interface RoundManagerStartRepository {
  findById(id: string): Promise<GamePlayerDTO | null>,
  getPlayers(): Promise<GamePlayerDTO[]>
}

export interface IRoundsManager {
  startMoments(
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

  constructor(
      private deck: IGameDeck,
      private players: IPlayersManager,
      private roundsManager: IRoundsManager,
  ) {}

  public handlePlayerConnected(id: string) {
    this.players.connectPlayer(id);
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

    this.roundsManager
        .startMoments(this.deck);
  }

  public getPlayers() {
    return this.players.getPlayers();
  }

  private setupPlayers() {
    this.players.setupPlayers({
      gold: Game.INITIAL_GOLD,
    });
  }
}
