import {NextApiRequest} from 'next';
import {
  CookiesHandler,
} from '../../../application/server/cookies/CookiesHandler';
import {
  NextApiResponseServerIO,
} from '../../../application/server/socket/SocketServer';
import {
  SocketServerSingleton,
} from '../../../application/server/socket/SocketServerSingleton';
import {
  JoinGameService,
} from '../../../domain/usecases/JoinGame/JoinGameService';

export interface LobbyResponse {
  token: string
}

const handler = async (
    req: NextApiRequest,
    res: NextApiResponseServerIO<LobbyResponse>,
) => {
  try {
    if (req.method !== 'POST') {
      return res.status(405).end();
    }

    console.log('entering lobby');

    SocketServerSingleton.getInstance(res);

    const token = CookiesHandler.findCookie(req) ||
      CookiesHandler.createCookie(res);

    const {gameId} = req.body as Record<string, unknown>;

    if (!gameId || typeof gameId !== 'string') {
      throw new Error('INVALID_GAME_ID');
    }

    const connectService = new JoinGameService();

    await connectService.execute(token, gameId);

    return res.status(200).json({token});
  } catch (err) {
    console.error(err);
    res.status(500).end();
  }
};

export default handler;
