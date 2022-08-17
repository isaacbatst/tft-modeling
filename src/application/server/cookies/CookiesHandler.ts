import cookie, {CookieParseOptions} from 'cookie';
import {NextApiRequest} from 'next';
import {randomUUID} from 'node:crypto';
import {NextApiResponseServerIO} from '../socket/SocketServer';

export class CookiesHandler {
  static COOKIE_NAME = 'X-TFT-Cookie';

  static parse(str: string, options?: CookieParseOptions) {
    return cookie.parse(str, options);
  }

  static findOrCreateCookie(
      req: NextApiRequest, res: NextApiResponseServerIO,
  ): string {
    const parsed = cookie.parse(req.headers.cookie as string || '');
    if (parsed[CookiesHandler.COOKIE_NAME]) {
      return parsed[CookiesHandler.COOKIE_NAME];
    }
    const token = randomUUID();
    const serialized = cookie.serialize(CookiesHandler.COOKIE_NAME, token, {
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
}
