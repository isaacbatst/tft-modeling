import {NextApiRequest} from 'next';
import {
  GameServerSingleton,
} from '../../application/server/game/GameServerSingleton';
import {
  SocketServerSingleton,
} from '../../application/server/socket/SocketServerSingleton';
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
    if (req.method !== 'POST') {
      return res.status(405).end();
    }

    const socketServer = SocketServerSingleton.getInstance(res);
    console.log('entering lobby');
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
  } catch (err) {
    res.status(500).end();
  }
};

export default handler;
