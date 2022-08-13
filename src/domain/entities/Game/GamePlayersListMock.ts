import {IGamePlayer, IGamePlayersList} from './Game';
import {GamePlayerMock} from './GamePlayerMock';

export class GamePlayersListMock implements IGamePlayersList {
  private players: IGamePlayer[] = [
    new GamePlayerMock('any-id-1'),
    new GamePlayerMock('any-id-2'),
  ];

  makeCouples = jest.fn((): [IGamePlayer, IGamePlayer][] => {
    return [];
  });

  getAll(): IGamePlayer[] {
    return this.players;
  }
}
