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
  id: string;
  name: string;
  connected: boolean,
  gold: number
  isOwner: boolean
  life: number
  // gold: number;
  // life: number;
  // board: PlayerBoard;
  // bench: PlayerBench;
  // hand: PlayerHand;
}

interface PlayerParams {
  id: string,
  isOwner: boolean;
  name: string;
}

export class Player {
  private id: string;
  private life: number;
  private gold: number;
  private connected: boolean;
  private isOwner: boolean;
  private name: string;

  constructor(params: PlayerParams) {
    this.id = params.id;
    this.isOwner = params.isOwner;
    this.name = params.name;
    this.life = 100;
    this.gold = 5;
    this.connected = true;
  }

  getDTO(): IPlayer {
    return {
      connected: this.connected,
      gold: this.gold,
      id: this.id,
      isOwner: this.isOwner,
      life: this.life,
      name: this.name,
    };
  }
}
