import {NextApiRequest} from 'next';
import {GameSingleton} from '../../application/factories/GameSingleton';
import {
  NextApiResponseServerIO,
} from '../../application/server/socket/SocketServer';
import {GamePlayerDTO} from '../../domain/entities/Game/Game';

export interface LobbyResponse {
  game: {
    players: GamePlayerDTO[],
  },
  token: string
}

const handler = (req: NextApiRequest,
    res: NextApiResponseServerIO<LobbyResponse>) => {
  if (req.method === 'POST') {
    const game = GameSingleton.getInstance(req, res);
    const token = GameSingleton.handleConnectedUser(req, res, game);

    return res.status(200).json(
        {
          game: {
            players: game.getPlayers(),
          },
          token,
        },
    );
  }

  res.status(405).end();
};

export default handler;
