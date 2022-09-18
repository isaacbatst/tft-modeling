import {NextApiRequest} from 'next';
import {CookiesHandler} from '../../application/server/cookies/CookiesHandler';
import {
  NextApiResponseServerIO,
} from '../../application/server/socket/SocketServer';
import {
  GameStartService,
} from '../../domain/usecases/GameStart/GameStartService';

const handler = async (req: NextApiRequest, res: NextApiResponseServerIO) => {
  try {
    if (req.method !== 'POST') {
      return res.status(405).end();
    }

    const token = CookiesHandler.findCookie(req);

    if (!token) {
      return res.status(401).end();
    }

    const service = new GameStartService();

    await service.execute(token);
    return res.status(200).end();
  } catch (err) {
    console.error(err);
    return res.status(500).end();
  }
};

export default handler;
