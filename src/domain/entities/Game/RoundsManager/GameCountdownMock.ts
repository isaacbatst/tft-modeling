import {IGameCountdown} from './Carousel';

export class CountdownMock implements IGameCountdown {
  start = jest.fn();
  subscribe = jest.fn(() => jest.fn());
  unsubscribe = jest.fn();
}
