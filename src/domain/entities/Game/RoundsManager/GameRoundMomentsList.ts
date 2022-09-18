import {IGameMomentsList} from '../../../usecases/GameStart/GameMoments';
import {GamePlayerDTO, IGameDeck} from '../Game';

export interface IGameRoundMoment {
  start(players: GamePlayerDTO[], deck: IGameDeck): Promise<void>
  getName(): string
}

enum GameRoundMomentsErrors {
  LAST_STAGE_NOT_MATCHES_ROUNDS = 'LAST_STAGE_NOT_MATCHES_ROUNDS',
  MIN_LAST_STAGE = 'MIN_LAST_STAGE',
  MIN_ROUND_PER_STAGE = 'MIN_ROUND_PER_STAGE',
  MOMENTS_LENGTH_NOT_MATCHES_ROUNDS = 'MOMENTS_LENGTH_NOT_MATCHES_ROUNDS'
}

export interface RoundManager {
  getNextRound(round: number, stage: number, lastStage: number): Promise<void>
}

export class GameRoundMomentsList implements IGameMomentsList {
  private lastStage: number;
  private roundsPerStage: number[];
  private moments: IGameRoundMoment[];

  constructor(
      moments: IGameRoundMoment[],
      lastStage: number,
      roundsPerStage: number[],
  ) {
    this.validateLastStage(lastStage);
    this.validateRoundsPerStage(roundsPerStage, lastStage);
    this.validateMoments(moments, roundsPerStage);
    this.moments = moments;
    this.lastStage = lastStage;
    this.roundsPerStage = roundsPerStage;
  }

  public getLastStage(): number {
    return this.lastStage;
  }

  public getStageRounds(stage: number): number {
    return this.roundsPerStage[stage - 1];
  }

  public getAll(): IGameRoundMoment[] {
    return this.moments;
  }

  public getStageRoundsNames(stage: number): { name: string; }[] {
    return this.getStageMoments(stage)
        .map((moment) => ({name: moment.getName()}));
  }

  private getStageMoments(stage: number): IGameRoundMoment[] {
    let start = 0;

    for (let index = (stage - 1); index >= 0; index -= 1) {
      start += this.roundsPerStage[index];
    }

    const end = start + this.roundsPerStage[stage];

    return this.moments
        .slice(start, end);
  }

  private validateLastStage(lastStage: number) {
    if (lastStage < 1) {
      throw new Error(GameRoundMomentsErrors.MIN_LAST_STAGE);
    }
  }

  private validateRoundsPerStage(roundsPerStage: number[], lastStage: number) {
    if (roundsPerStage.length !== lastStage) {
      throw new Error(GameRoundMomentsErrors.LAST_STAGE_NOT_MATCHES_ROUNDS);
    }

    roundsPerStage.forEach((rounds) => {
      if (rounds < 1) {
        throw new Error(GameRoundMomentsErrors.MIN_ROUND_PER_STAGE);
      }
    });
  }

  private validateMoments(
      moments: IGameRoundMoment[], roundsPerStage: number[],
  ) {
    const roundSum = roundsPerStage.reduce((acc, curr) => acc + curr, 0);

    if (moments.length !== roundSum) {
      throw new Error(GameRoundMomentsErrors.MOMENTS_LENGTH_NOT_MATCHES_ROUNDS);
    }
  }
}
