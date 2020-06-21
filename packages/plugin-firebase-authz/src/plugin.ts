import hapiAuthorizationHeader from '@hounddesk/hapi-authorization-header';
import { FirebaseAuthzPluginOptions } from './types';
import { Credential } from './types';

export async function getCredentials(
  authorizationHeader: string,
  settings: FirebaseAuthzPluginOptions
): Promise<Credential> {
  const bearerToken = hapiAuthorizationHeader.getTokenFromAuthorizationHeader(
    authorizationHeader,
    hapiAuthorizationHeader.SupportedAuthorizationHeader.BearerToken
  );

  const decodedToken = await settings.serviceAccount
    .auth()
    .verifyIdToken(bearerToken);

  const { user_id, email, email_verified } = decodedToken;
  const scopes = settings.userClaims
    ? settings.userClaims.filter((userClaim) => decodedToken[userClaim])
    : [];
  return {
    user: { userId: user_id, email, emailVerified: email_verified },
    scope: scopes,
  };
}
