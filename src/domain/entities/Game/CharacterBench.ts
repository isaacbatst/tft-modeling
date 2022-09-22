interface CharacterInBench {
  id: string,
  position: number;
}

export interface IBench {
  getCharacters(): CharacterInBench[]
}

export interface BenchParams {
  characters: CharacterInBench[]
}

export class Bench implements IBench {
  private characters: CharacterInBench[];

  constructor(params: BenchParams) {
    this.validateBench(params.characters);
    this.characters = params.characters;
  }

  private validateBench(characters: CharacterInBench[]) {
    if (characters.length > 9) {
      throw new Error('CHARACTERS_LENGTH_ABOVE_MAX');
    }

    const hasRepeatedPosition = characters.some((character, index) => {
      return characters.some((character2, index2) => {
        character.position === character2.position && index !== index2;
      });
    });

    if (hasRepeatedPosition) {
      throw new Error('CHARACTER_WITH_REPEATED_POSITIION');
    }
  }

  public getCharacters() {
    return [...this.characters];
  }
}
