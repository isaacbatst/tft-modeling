// import {Character, CharacterAttributes, Sinergy} from './Character';
// import {Item} from './Item';

// class CharacterInGame {
//   private character: Character;
//   private level: number;
//   private attributes: CharacterAttributes;
//   private items: Item[];
// }

// class PlayerBoard {
//   characters: CharacterInGame[];
//   sinergies: Sinergy[];
// }

// class PlayerBench {
//   characters: CharacterInGame[];
// }

// class PlayerHand {
//   private characters: Character[];
// }

export interface IPlayer {
  name: string;
  // gold: number;
  // life: number;
  // board: PlayerBoard;
  // bench: PlayerBench;
  // hand: PlayerHand;
}

export enum GameErrors {
  BELLOW_MIN_PLAYERS = 'BELLOW_MIN_PLAYERS'
}

export class Game {
  private players: IPlayer[];

  constructor(players: IPlayer[]) {
    this.validatePlayers(players);

    this.players = players;
  }

  private validatePlayers(players: IPlayer[]) {
    if (players.length < 2) {
      throw new Error(GameErrors.BELLOW_MIN_PLAYERS);
    }
  }
}
