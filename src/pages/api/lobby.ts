import {NextApiRequest} from 'next';
import {
  GameServerSingleton,
} from '../../application/factories/GameServerSingleton';
import {
  SocketServerSingleton,
} from '../../application/factories/SocketServerSingleton';
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
  try {
    if (req.method === 'POST') {
      const socketServer = SocketServerSingleton.getInstance(res);
      const gameServer = GameServerSingleton.getInstance(socketServer);
      const token = gameServer.handleConnectedUser(req, res);

      return res.status(200).json(
          {
            game: {
              players: gameServer.getPlayers(),
            },
            token,
          },
      );
    }

    res.status(405).end();
  } catch (err) {
    res.status(500).end();
  }
};

export default handler;
