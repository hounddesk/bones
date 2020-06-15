import Hoek from '@hapi/hoek';
import Boom from '@hapi/boom';
import BearerTokenParser from '@hounddesk/hapi-bearer-parser';

import { SupportedAuthorizationHeader } from './types';

const supportedHeaderParsers = {
  [SupportedAuthorizationHeader.BearerToken]: BearerTokenParser,
};

function validateHeader(header: string): void {
  Hoek.assert(header, Boom.unauthorized('Missing authorization header'));
}

export function getTokenFromAuthorizationHeader(
  authorizationHeader: string,
  authorizationHeaderType: SupportedAuthorizationHeader
): string {
  validateHeader(authorizationHeader);
  return supportedHeaderParsers[authorizationHeaderType](authorizationHeader);
}
