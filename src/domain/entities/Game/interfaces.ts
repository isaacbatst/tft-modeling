import {GamePlayers} from './GamePlayers';
import {IPlayer} from './Player';
import {DeckForCarousel} from './RoundsManager/Carousel';

export interface IHand {}
export interface IGameDeck extends DeckForCarousel {
  takeRandomHand(): IHand[];
}

export interface RoundManagerStartRepository {
  findById(id: string): Promise<IPlayer | null>,
  getPlayers(): Promise<IPlayer[]>
}

export interface IGameMoments {
  start(
    deck: IGameDeck,
    players: GamePlayers
  ): Promise<void>,
}
