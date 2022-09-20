import {DeckForCarousel} from './RoundsManager/Carousel';

export interface IHand {}
export interface IGameDeck extends DeckForCarousel {
  takeRandomHand(): IHand[];
}

export interface RoundManagerStartRepository {
  findById(id: string): Promise<GamePlayerDTO | null>,
  getPlayers(): Promise<GamePlayerDTO[]>
}

export interface IGameMoments {
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
