import {
  GamePlayerDTO,
  IGameDeck, IRoundsManager, RoundManagerStartRepository,
} from '../../entities/Game/Game';
import {
  IGameRoundMoment,
} from '../../entities/Game/RoundsManager/GameRoundMomentsList';

export interface IGameMomentsList {
  getAll(): IGameRoundMoment[],
  getLastStage(): number
  getStageRounds(stage: number): number,
  getStageRoundsNames(stage: number): { name: string }[]
}

export enum GameRoundMomentsErrors {
  INVALID_ROUND_FOR_STAGE = 'INVALID_ROUND_FOR_STAGE',
  INVALID_STAGE_AFTER_LAST = 'INVALID_STAGE_AFTER_LAST'
}

export interface Round {
  name: string
}

export interface RoundsManagerState {
  stage: number;
  round: number;
  stageRounds: Round[]
}

export interface RoundsManagerEventsDispatcher {
  roundStart(state: RoundsManagerState): void
}

export class RoundsManager implements IRoundsManager {
  private stage = 0;
  private round = 0;

  constructor(
    private moments: IGameMomentsList,
    private dispatcher: RoundsManagerEventsDispatcher,
    private repository: RoundManagerStartRepository,
  ) {
  }

  async startMoments(
      deck: IGameDeck,
  ):
      Promise<void> {
    this.stage = 1;
    this.round = 1;

    const moments = this.moments.getAll();

    for (let index = 0; index < moments.length; index += 1) {
      this.dispatchRoundStart();

      const moment = moments[index];

      const players = await this.repository.getPlayers();

      await moment.start(players, deck);

      if (this.checkIfShouldStop(players)) {
        break;
      }

      this.setNextRound();
    }
  }

  private dispatchRoundStart() {
    this.dispatcher.roundStart({
      round: this.round,
      stage: this.stage,
      stageRounds: this.moments.getStageRoundsNames(this.stage),
    });
  }

  private setNextRound() {
    const nextRound = this.getNextRound();
    this.round = nextRound.round;
    this.stage = nextRound.stage;
  }

  private getNextRound(): { round: number, stage: number } {
    const lastStage = this.moments.getLastStage();
    if (this.stage > lastStage) {
      throw new Error(GameRoundMomentsErrors.INVALID_STAGE_AFTER_LAST);
    }

    const stageRounds = this.moments.getStageRounds(this.stage);

    if (this.round > stageRounds) {
      throw new Error(GameRoundMomentsErrors.INVALID_ROUND_FOR_STAGE);
    }

    if (this.round === stageRounds) {
      return {
        round: 1,
        stage: this.stage + 1,
      };
    }

    return {
      round: this.round + 1,
      stage: this.stage,
    };
  }

  private checkIfShouldStop(players: GamePlayerDTO[]): boolean {
    const remainingPlayers = players.filter((player) => player.life > 0);
    const isOnlyOnePlayerRemaining = remainingPlayers.length < 2;

    const lastStage = this.moments.getLastStage();
    const stageRounds = this.moments.getStageRounds(this.stage);

    const isLastStage = lastStage === this.stage;
    const isLastRound = stageRounds === this.round;

    const isLastStageLastRound = isLastStage && isLastRound;

    return isOnlyOnePlayerRemaining || isLastStageLastRound;
  }
}
