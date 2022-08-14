import {IGamePlayer, IGamePlayersList, PlayerCouple} from './Game';
import {GamePlayerMock} from './GamePlayerMock';

export class GamePlayersListMock implements IGamePlayersList {
  private players: IGamePlayer[] = [
    new GamePlayerMock('any-id-1'),
    new GamePlayerMock('any-id-2'),
  ];

  public addPlayer = jest.fn((): void => {

  });

  public validatePlayers = jest.fn((): void => {

  });

  makeBattleCouples = jest.fn((): PlayerCouple[] => {
    return [];
  });

  getAll(): IGamePlayer[] {
    return this.players;
  }

  makeCarouselCouples(): PlayerCouple[] {
    const [player1, player2] = this.players;
    return [
      [player1, player2],
    ];
  }
}
