import {NextApiRequest} from 'next';
import {GameFactory} from '../../application/factories/GameFactory';
import {
  SocketServerFactory,
} from '../../application/factories/SocketServerFactory';
import {NextApiResponseServerIO} from '../../application/socket/SocketServer';
import cookie from 'cookie';
import {randomUUID} from 'crypto';
import {Socket} from 'socket.io';

const handler = (req: NextApiRequest, res: NextApiResponseServerIO) => {
  const io = SocketServerFactory.make(res);

  const game = GameFactory.make(io);

  const handleConnection = (socket: Socket) => {
    const token = findOrCreateCookie(socket, res);
    game.addPlayer(token);
  };

  io.off('connection', handleConnection);

  io.on('connection', handleConnection);

  res.end();
};

const findOrCreateCookie = (socket: Socket, res: NextApiResponseServerIO) => {
  const parsed = cookie.parse(socket.request.headers.cookie || '');

  if (parsed['tft-cookie']) {
    return parsed['tft-cookie'];
  }

  const token = randomUUID();
  const serialized = cookie.serialize('X-TFT-Cookie', token, {
    path: '/',
    maxAge: 86400,
    httpOnly: true,
  });

  res.setHeader(
      'Set-Cookie',
      serialized,
  );

  return token;
};

export default handler;
