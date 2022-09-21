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
  connected: boolean,
  gold: number
  life: number
  // gold: number;
  // life: number;
  // board: PlayerBoard;
  // bench: PlayerBench;
  // hand: PlayerHand;
}

interface PlayerParams {
  id: string,
}

export class Player {
  private id: string;
  private life: number;
  private gold: number;
  private connected: boolean;

  constructor(params: PlayerParams) {
    this.id = params.id;
    this.life = 100;
    this.gold = 5;
    this.connected = true;
  }

  getDTO(): IPlayer {
    return {
      connected: this.connected,
      gold: this.gold,
      id: this.id,
      life: this.life,
    };
  }

  static toInstance(player: IPlayer): Player {
    return new Player({
      id: player.id,
    });
  }
}
