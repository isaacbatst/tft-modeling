import {NextApiRequest} from 'next';
import {CookiesHandler} from '../../application/server/cookies/CookiesHandler';
import {GameSocket} from '../../application/server/socket/interfaces';
import {
  NextApiResponseServerIO,
} from '../../application/server/socket/SocketServer';
import {
  SocketServerSingleton,
} from '../../application/server/socket/SocketServerSingleton';
import {
  PlayerConnectionService,
} from '../../domain/usecases/PlayerConnection/PlayerConnectionService';
import {PlayerDisconnectionService} from '../../domain/usecases/PlayerDisconnection/PlayerDisconnectionService';

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

    const connectService = new PlayerConnectionService();

    await connectService.execute(token);

    return res.status(200).json({token});
  } catch (err) {
    res.status(500).end();
  }
};

export default handler;
