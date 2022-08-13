// import {Character, CharacterAttributes, Sinergy} from './Character';
// import {Item} from './Item';
export enum GameErrors {
  INVALID_ROUND_FOR_STAGE = 'INVALID_ROUND_FOR_STAGE',
  INVALID_STAGE_AFTER_LAST = 'INVALID_STAGE_AFTER_LAST'
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

export interface IGamePlayersList {
  getAll(): IGamePlayer[];
  makeCouples(): [IGamePlayer, IGamePlayer][]
}

export interface IGameRoundMoment {
  start(players: IGamePlayersList): Promise<void>
}

enum GameStage {
  First = 1,
  Second = 2,
  Third = 3,
  Forth = 4,
  Fifth = 5,
  Sixth = 6,
  Seventh = 7,
}

export class Game {
  static INITIAL_GOLD = 3;
  static ROUND_PREPARATION_TIME = 3;
  static ROUND_BATTLE_TIME = 5;
  static GOLD_PER_ROUND = 5;
  static LAST_STAGE = 7;
  static ROUNDS_PER_STAGE: Record<GameStage, number> = {
    1: 4,
    2: 7,
    3: 7,
    4: 7,
    5: 7,
    6: 7,
    7: 7,
  };

  private players: IGamePlayersList;
  private deck: GameDeck;
  private stage: GameStage;
  private round: number;
  private roundMoments: IGameRoundMoment;

  constructor(
      deck: GameDeck,
      playersList: IGamePlayersList,
      roundMoments: IGameRoundMoment,
  ) {
    this.stage = 1;
    this.round = 1;
    this.deck = deck;
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

      this.prepareNextRound();
    }

    return {
      players: this.players.getAll(),
      round: this.round,
      stage: this.stage,
    };
  }

  private prepareNextRound() {
    this.refillPlayers();

    const nextRound = this.getNextRound();
    this.round = nextRound.round;
    this.stage = nextRound.stage;
  }

  private getNextRound(): { round: number, stage: GameStage } {
    if (this.stage > Game.LAST_STAGE) {
      throw new Error(GameErrors.INVALID_STAGE_AFTER_LAST);
    }

    if (this.round > Game.ROUNDS_PER_STAGE[this.stage]) {
      throw new Error(GameErrors.INVALID_ROUND_FOR_STAGE);
    }

    if (this.round === Game.ROUNDS_PER_STAGE[this.stage]) {
      return {
        round: 1,
        stage: this.stage + 1,
      };
    }

    return {
      round: this.round + 1,
      stage: this.stage,
    };
  }

  private checkIfShouldStop(): boolean {
    const players = this.players.getAll();
    const remainingPlayers = players.filter((player) => player.getLife() > 0);
    const isOnlyOnePlayerRemaining = remainingPlayers.length < 2;

    const isLastStage = Game.LAST_STAGE === this.stage;
    const isLastRound = Game.ROUNDS_PER_STAGE[this.stage] === this.round;

    const isLastStageLastRound = isLastStage && isLastRound;

    return isOnlyOnePlayerRemaining || isLastStageLastRound;
  }

  private refillPlayers() {
    this.players.getAll().forEach((player) => {
      player.incrementGold(Game.GOLD_PER_ROUND);

      const hand = this.deck.takeRandomHand();
      player.setHand(hand);
    });
  }
}
