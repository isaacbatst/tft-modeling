import {GamePlayerDTO} from './Game';
import {RoundsManagerState} from '../../usecases/GameStart/GameMoments';

export interface GameState {
  players: GamePlayerDTO[],
  rounds: RoundsManagerState,
}
