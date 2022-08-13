import {IGameCountdown} from './Game';

enum GameCountdownErrors {
  MIN_CURRENT_TIME_VALUE = 'MIN_CURRENT_TIME_VALUE',
  MIN_ROUND_TIME_VALUE = 'MIN_ROUND_TIME_VALUE'
}

export class GameCountdown implements IGameCountdown {
  private currentTime: number;
  private countdownSubscribers: Function[];
  private roundTime: number;

  constructor(roundTime: number) {
    this.validateRoundTime(roundTime);

    this.roundTime = roundTime;
    this.currentTime = 0;
    this.countdownSubscribers = [];
  }

  public async start() {
    this.setCurrentTime(this.roundTime);

    const interval = setInterval(() => {
      this.setCurrentTime(this.currentTime - 1);
    }, 1000);

    await this.startTimer();

    clearInterval(interval);
  }

  public subscribe(callback: (currentTime: number) => void): number {
    return this.countdownSubscribers.push(callback) - 1;
  }

  public unsubscribe(index: number) {
    this.countdownSubscribers.splice(index, 1);
  }

  private setCurrentTime(value: number) {
    if (value < 0) {
      throw new Error(GameCountdownErrors.MIN_CURRENT_TIME_VALUE);
    }

    this.currentTime = value;
    this.dispatchCountdownChange();
  }

  private startTimer() {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, this.roundTime * 1000);
    });
  }

  private dispatchCountdownChange() {
    this.countdownSubscribers
        .forEach((callback) => callback(this.currentTime));
  }

  private validateRoundTime(value: number) {
    if (value < 0) {
      throw new Error(GameCountdownErrors.MIN_ROUND_TIME_VALUE);
    }

    this.roundTime = value;
  }
}
