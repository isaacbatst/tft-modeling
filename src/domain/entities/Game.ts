import {Character, CharacterAttributes, Sinergy} from './Character';
import {Item} from './Item';

class CharacterInGame {
  private character: Character;
  private level: number;
  private attributes: CharacterAttributes;
  private items: Item[];
}

class PlayerBoard {
  characters: CharacterInGame[];
  sinergies: Sinergy[];
}

class PlayerBench {
  characters: CharacterInGame[];
}

class PlayerHand {
  private characters: Character[];
}

class Player {
  private name: string;
  private gold: number;
  private life: number;
  private board: PlayerBoard;
  private bench: PlayerBench;
  private hand: PlayerHand;
}

export class Game {
  private players: Player[];
}
