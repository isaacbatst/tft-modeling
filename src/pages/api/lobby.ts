import {NextApiRequest} from 'next';
import {GameSingleton} from '../../application/factories/GameSingleton';
import {NextApiResponseServerIO} from '../../application/socket/SocketServer';
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
    const {game, token} = GameSingleton.make(req, res);

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
