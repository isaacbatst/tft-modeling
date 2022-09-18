import {Schema} from 'mongoose';
import {GameState} from '../../../../domain/entities/Game/GameState';
import {
  Round,
  RoundsManagerState,
} from '../../../../domain/usecases/GameStart/GameMoments';

const GamePlayerSchema = new Schema<GameState['players'][number]>({
  connected: Boolean,
  gold: Number,
  id: String,
  isOwner: Boolean,
  life: Number,
});

const RoundSchema = new Schema<Round>({
  name: String,
});

const RoundsManagerStateSchema = new Schema<RoundsManagerState>({
  round: Number,
  stage: Number,
  stageRounds: [RoundSchema],
});

export const GameStateSchema = new Schema<GameState>({
  players: [GamePlayerSchema],
  rounds: [RoundsManagerStateSchema],
});
