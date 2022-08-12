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
  // gold: number;
  // life: number;
  // board: PlayerBoard;
  // bench: PlayerBench;
  // hand: PlayerHand;
}
