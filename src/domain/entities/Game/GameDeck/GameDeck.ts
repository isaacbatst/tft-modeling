import {IGameDeck, IHand} from '../Game';
import {
  ICarouselBoard,
  ICharacter, ICharacterInGame, IItem} from '../RoundsManager/Carousel';

class Character implements ICharacter {
  constructor(
    private name: string,
  ) {}

  getName(): string {
    return this.name;
  }
}

class Item implements IItem {
  constructor(
    private name: string,
  ) {}

  getName(): string {
    return this.name;
  }
}

class CharacterInGame implements ICharacterInGame {
  constructor(
    private character: ICharacter,
    private items: IItem[],
  ) {}

  getCharacter(): ICharacter {
    return this.character;
  }

  getItems(): IItem[] {
    return this.items;
  }
}

class CarouselBoard implements ICarouselBoard {
  getAll(): ICharacterInGame[] {
    const character1 = new Character('character-1');
    const character2 = new Character('character-2');
    const item1 = new Item('item-1');
    const item2 = new Item('item-2');

    return [
      new CharacterInGame(character1, [item1]),
      new CharacterInGame(character2, [item2]),
    ];
  }
}

export class GameDeck implements IGameDeck {
  takeRandomHand(): IHand[] {
    return [];
  }
  takeRandomCarouselBoard(): ICarouselBoard {
    return new CarouselBoard();
  }
}
