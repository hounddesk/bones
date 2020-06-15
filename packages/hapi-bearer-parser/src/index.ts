import Hoek from '@hapi/hoek';
import Boom from '@hapi/boom';

export default function (authorizationHeader: string): string {
  const [bearer, token] = authorizationHeader.split(/\s+/);
  Hoek.assert(bearer && bearer.toLowerCase() === 'bearer', Boom.unauthorized());
  Hoek.assert(
    token,
    Boom.unauthorized('Bad HTTP authentication header format')
  );
  return token;
}
