import {NextApiRequest} from 'next';
import {GameFactory} from '../../application/factories/GameFactory';
import {NextApiResponseServerIO} from '../../application/socket/SocketServer';
import {GamePlayerDTO} from '../../domain/entities/Game/Game';

export interface LobbyResponse {
  game: {
    players: GamePlayerDTO[]
  }
}

const handler = (req: NextApiRequest,
    res: NextApiResponseServerIO<LobbyResponse>) => {
  if (req.method === 'POST') {
    const game = GameFactory.make(req, res);

    return res.status(200).json({game: {
      players: game.getPlayers(),
    }});
  }

  res.status(405).end();
};

export default handler;
