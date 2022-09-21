import {CarouselState} from '../../entities/Game/RoundsManager/Carousel';

export interface SelectCarouselCharacterParams {
  playerId: string,
  lobbyId: string,
  characterId: string
}

interface SelectCarouselCharacterRepository {
  getCarouselState(): Promise<CarouselState>
  selectCharacter(
    characterId: string, lobbyId: string, playerId: string): Promise<void>
}

export class SelectCarouselCharacterService {
  constructor(
    private repository: SelectCarouselCharacterRepository,
  ) {}

  async execute(params: SelectCarouselCharacterParams) {
    const {
      characterId, lobbyId, playerId,
    } = params;

    const state = await this.repository.getCarouselState();

    const playerCoupleIndex = state.couples
        .findIndex(([player1, player2]) => (
          player1.id === playerId || player2.id === playerId
        ));

    if (state.releaseIndex < playerCoupleIndex) {
      throw new Error('PLAYER_NOT_RELEASED');
    }

    const character = state.board
        .find((character) => character.id === characterId);

    if (!character) {
      throw new Error('CHARACTER_NOT_FOUND');
    }

    if (character.selectedBy) {
      throw new Error('CHARACTER_ALREADY_SELECTED');
    }

    await this.repository.selectCharacter(
        characterId,
        lobbyId,
        playerId,
    );
  }
}
