import {IGameDeck, IGamePlayersList, IRoundsManager} from '../Game';


export interface IGameRoundMoment {
  start(players: IGamePlayersList, deck: IGameDeck): Promise<void>
}
export interface IGameRoundMomentsList {
  getAll(): IGameRoundMoment[],
  getLastStage(): number
  getStageRounds(stage: number): number
}

export enum GameRoundMomentsErrors {
  INVALID_ROUND_FOR_STAGE = 'INVALID_ROUND_FOR_STAGE',
  INVALID_STAGE_AFTER_LAST = 'INVALID_STAGE_AFTER_LAST'
}

export class RoundsManager implements IRoundsManager {
  private stage = 0;
  private round = 0;

  constructor(
    private moments: IGameRoundMomentsList,
  ) {
  }

  async start(
      players: IGamePlayersList,
      goldPerRound: number,
      deck: IGameDeck,
  ):
      Promise<void> {
    this.stage = 1;
    this.round = 1;

    const moments = this.moments.getAll();

    for (let index = 0; index < moments.length; index += 1) {
      const moment = moments[index];
      await moment.start(players, deck);

      if (this.checkIfShouldStop(players)) {
        break;
      }

      this.setNextRound(players, goldPerRound, deck);
    }
  }

  private setNextRound(
      players: IGamePlayersList,
      goldPerRound: number,
      deck: IGameDeck,
  ) {
    this.refillPlayers(players, goldPerRound, deck);

    const nextRound = this.getNextRound();
    this.round = nextRound.round;
    this.stage = nextRound.stage;
  }

  private refillPlayers(
      players: IGamePlayersList,
      goldPerRound: number,
      deck: IGameDeck,
  ) {
    players.getAll().forEach((player) => {
      player.incrementGold(goldPerRound);

      const hand = deck.takeRandomHand();
      player.setHand(hand);
    });
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

  private checkIfShouldStop(playersList: IGamePlayersList): boolean {
    const players = playersList.getAll();
    const remainingPlayers = players.filter((player) => player.getLife() > 0);
    const isOnlyOnePlayerRemaining = remainingPlayers.length < 2;

    const lastStage = this.moments.getLastStage();
    const stageRounds = this.moments.getStageRounds(this.stage);

    const isLastStage = lastStage === this.stage;
    const isLastRound = stageRounds === this.round;

    const isLastStageLastRound = isLastStage && isLastRound;

    return isOnlyOnePlayerRemaining || isLastStageLastRound;
  }
}
