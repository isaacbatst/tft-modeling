import {PositionValueType} from './Position';

interface Position<T extends PositionValueType> {
  getPosition(): T
}

export class BenchPosition implements Position<number> {
  private position: number;

  constructor(position: number) {
    this.position = position;

    this.validatePosition();
  }

  getPosition(): number {
    return this.position;
  }

  private validatePosition() {
    if (this.position < 0) {
      throw new Error('POSITION_BELLOW_MIN');
    }

    if (this.position > 8) {
      throw new Error('POSITION_ABOVE_MIN');
    }
  }
}
