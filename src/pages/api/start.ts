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

const handler = (req: NextApiRequest, res: NextApiResponseServerIO) => {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const socketServer = SocketServerSingleton.getInstance(res);
  const gameServer = GameServerSingleton.getInstance(socketServer);
  const token = gameServer.getUserToken(req);

  if (!token) {
    return res.status(405).end();
  }

  gameServer.startGame(token);
  return res.status(200).end();
};

export default handler;
