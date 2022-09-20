import {IPlayer} from './Game';
import {RoundsManagerState} from '../../usecases/GameStart/GameMoments';

export interface GameState {
  players: IPlayer[],
  rounds: RoundsManagerState,
}
