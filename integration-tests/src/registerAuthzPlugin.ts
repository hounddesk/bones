import Hapi from '@hapi/hapi';
import * as admin from 'firebase-admin';
import pluginFirebaseAuthz from '@hounddesk/plugin-firebase-authz';

export default async function registerAuthzPlugin(
  server: Hapi.Server,
  firebaseApp: admin.app.App
): Promise<void> {
  // Register authorization strategy (Firebase JWT)
  await server.register({
    plugin: pluginFirebaseAuthz,
    options: {
      serviceAccount: firebaseApp,
      logger: console,
      userClaims: ['admin'], // optional
      schemeName: 'firebase', // optional, by default will use firebase
    },
  });
  server.auth.strategy('firebase', 'firebase');
}
