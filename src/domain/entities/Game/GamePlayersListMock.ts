import {
  GamePlayerDTO, IGamePlayersList,
} from './Game';
import {PlayerCoupleDTO} from './GamePlayersList';

export class GamePlayersListMock implements IGamePlayersList {
  private player1DTO: GamePlayerDTO = {
    id: 'any-id-1',
    connected: true,
    gold: 100,
    life: 100,
  };

  private player2DTO: GamePlayerDTO = {
    id: 'any-id-2',
    connected: true,
    gold: 100,
    life: 100,
  };

  public addPlayer = jest.fn();

  public validatePlayers = jest.fn();

  makeBattleCouples = jest.fn((): PlayerCoupleDTO[] => {
    return [];
  });

  makeCarouselCouples(): PlayerCoupleDTO[] {
    return [
      [
        this.player1DTO,
        this.player2DTO,
      ],
    ];
  }

  getDTOList(): GamePlayerDTO[] {
    return [
      this.player1DTO,
      this.player2DTO,
    ];
  }

  setupPlayers = jest.fn();
  disconnectPlayer = jest.fn();
}
