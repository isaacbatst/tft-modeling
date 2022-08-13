import {IGamePlayersList} from '../Game';
import {IGameRoundMoment} from './GameRoundMoments';


export interface IGameCountdown {
  subscribe(callback: (time: number) => void): number;
  unsubscribe(index: number): void;
  start(roundTime: number): Promise<void>;
}

export class Carousel implements IGameRoundMoment {
  static COUNTDOWN_TIME = 30;

  constructor(
    private countdown: IGameCountdown,
  ) {}

  async start(players: IGamePlayersList): Promise<void> {
    console.log(
        'Starting carousel with',
        players.getAll().map((player) => player.getId()),
    );

    await this.startCountdown();
  }

  private startCountdown() {
    return this.countdown.start(Carousel.COUNTDOWN_TIME);
  }
}
