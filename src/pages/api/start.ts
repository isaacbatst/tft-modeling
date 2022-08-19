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

const handler = async (req: NextApiRequest, res: NextApiResponseServerIO) => {
  try {
    if (req.method !== 'POST') {
      return res.status(405).end();
    }

    const socketServer = SocketServerSingleton.getInstance(res);
    console.log('starting game');
    const gameServer = GameServerSingleton.getInstance(socketServer);
    const token = gameServer.getUserToken(req);

    if (!token) {
      return res.status(405).end();
    }

    await gameServer.startGame(token);
    return res.status(200).end();
  } catch (err) {
    console.error(err);
    return res.status(500).end();
  }
};

export default handler;
