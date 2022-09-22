import {ILobby} from '../../entities/Game/Lobby';
import {Coordinate, PositionValueType} from '../../entities/Position';

interface BaseMoveCharacterParams {
  playerId: string,
  characterId: string,
  lobbyId: string,
  to: string,
}

interface MoveCharacterToBenchParams extends BaseMoveCharacterParams {
  to: PositionType.BENCH,
  position: number
}

interface MoveCharacterToBoardParams extends BaseMoveCharacterParams {
  to: PositionType.BOARD,
  position: Coordinate
}

type MoveCharacterParams =
  MoveCharacterToBenchParams | MoveCharacterToBoardParams;

interface MoveCharacterCharacterInBench {
  id: string,
  position: number;
}

interface MoveCharacterBenchDTO {
  characters: MoveCharacterCharacterInBench[]
}

interface MoveCharacterPlayerDTO {
  id: string,
  bench: MoveCharacterBenchDTO
}

export interface MoveCharacterRepository {
  getLobby(lobbyId: string):
    Promise<ILobby & { players: MoveCharacterPlayerDTO[] } | null >
}

enum PositionType {
  BOARD = 'BOARD',
  BENCH = 'BENCH',
}

interface MoveCharacterPlayerMoveParams {
  characterId: string,
  position: PositionValueType,
  to: PositionType
}

interface MoveCharacterPlayer {
  moveCharacter(params: MoveCharacterPlayerMoveParams): void
}

interface MoveCharacterPlayerProvider {
  getPlayer(player: MoveCharacterPlayerDTO): MoveCharacterPlayer
}

export class MoveCharacterService {
  constructor(
    private repository: MoveCharacterRepository,
    private playerProvider: MoveCharacterPlayerProvider,
  ) {}

  async execute(params: MoveCharacterParams) {
    const {
      characterId, lobbyId, playerId, position, to,
    } = params;

    const lobby = await this.repository.getLobby(lobbyId);

    if (!lobby) {
      throw new Error('LOBBY_NOT_FOUND');
    }

    const playerDTO = lobby.players.find((player) => player.id === playerId);

    if (!playerDTO) {
      throw new Error('PLAYER_NOT_FOUND');
    }

    if (!this.isToValid(to)) {
      throw new Error('INVALID_TO');
    }

    const player = this.playerProvider.getPlayer(playerDTO);

    player.moveCharacter({
      characterId,
      position,
      to,
    });
  }

  private isToValid(to: string): to is PositionType {
    return to in PositionType;
  }
}
