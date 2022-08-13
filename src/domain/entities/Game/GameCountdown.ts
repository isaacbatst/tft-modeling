import {IGameCountdown} from './Game';

enum GameCountdownErrors {
  MIN_CURRENT_TIME_VALUE = 'MIN_CURRENT_TIME_VALUE',
  MIN_ROUND_TIME_VALUE = 'MIN_ROUND_TIME_VALUE'
}

export class GameCountdown implements IGameCountdown {
  private currentTime: number;
  private subscribers: Function[];
  private completeTime: number = 0;

  constructor() {
    this.currentTime = 0;
    this.subscribers = [];
  }

  public async start(completeTime: number) {
    this.setCompleteTime(completeTime);
    this.setCurrentTime(this.completeTime);

    const interval = setInterval(() => {
      this.setCurrentTime(this.currentTime - 1);
    }, 1000);

    await this.startTimer();

    clearInterval(interval);
  }

  public subscribe(callback: (currentTime: number) => void): number {
    return this.subscribers.push(callback) - 1;
  }

  public unsubscribe(index: number) {
    this.subscribers.splice(index, 1);
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
      }, this.completeTime * 1000);
    });
  }

  private dispatchCountdownChange() {
    this.subscribers
        .forEach((callback) => callback(this.currentTime));
  }

  private setCompleteTime(value: number) {
    if (value <= 0) {
      throw new Error(GameCountdownErrors.MIN_ROUND_TIME_VALUE);
    }

    this.completeTime = value;
  }
}
