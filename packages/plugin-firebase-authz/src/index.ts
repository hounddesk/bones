import Hapi from '@hapi/hapi';
import Boom from '@hapi/boom';
import Hoek from '@hapi/hoek';
import { HapiPlugin } from '@hounddesk/bones-types';
import { getCredentials } from './plugin';
import { FirebaseAuthzPluginOptions } from './types';
const DEFAULT_SCHEME_NAME = 'firebase';

function authenticate(settings: FirebaseAuthzPluginOptions) {
  return async function authenticate(
    request: Hapi.Request,
    h: Hapi.ResponseToolkit
  ): Promise<Hapi.Auth | void> {
    try {
      return h.authenticated({
        credentials: await getCredentials(
          request.headers.authorization,
          settings
        ),
      });
    } catch (error) {
      return error.isBoom
        ? h.unauthenticated(error)
        : h.unauthenticated(Boom.unauthorized());
    }
  };
}

function pluginImplementation(
  server: Hapi.Server,
  settings: FirebaseAuthzPluginOptions
) {
  Hoek.assert(settings.serviceAccount, 'Firebase admin service is required');
  return {
    authenticate: authenticate(settings),
  };
}

const pluginFirebaseAuthz: HapiPlugin<FirebaseAuthzPluginOptions> = {
  name: 'plugin-firebase-authz',
  multiple: true,
  register: function (
    server: Hapi.Server,
    settings: FirebaseAuthzPluginOptions
  ): void {
    const schemeName = settings.schemeName || DEFAULT_SCHEME_NAME;
    server.auth.scheme(schemeName, () =>
      pluginImplementation(server, settings)
    );
  },
};

export default pluginFirebaseAuthz;
