import {IPlayer} from '../../../domain/entities/Game/Player';
import {
  JoinGameRepository,
} from '../../../domain/usecases/JoinGame/JoinGameService';
import {prisma} from '../prisma';

export class PrismaPlayerRepository implements JoinGameRepository {
  async findPlayerById(id: string): Promise<IPlayer | null> {
    const player = await prisma.player.findUnique({
      where: {
        id,
      },
    });

    return player;
  }

  async add(player: IPlayer, lobbyId: string): Promise<void> {
    await prisma.player.create({
      data: {
        ...player,
        game: {
          connect: {
            id: lobbyId,
          },
        },
      },
    });
  }

  async getLobbySize(gameId: string): Promise<number | null> {
    const game = await prisma.game.findUnique({
      where: {
        id: gameId,
      },
      include: {
        players: true,
      },
    });

    if (!game) return null;

    return game.players.length;
  }
}
