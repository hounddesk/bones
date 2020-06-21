import Hapi from '@hapi/hapi';
import * as admin from 'firebase-admin';
import pluginFirebaseUsers from '@hounddesk/plugin-firebase-users';
import customPasswordPolicy from './passwordPolicy';

export default async function registerAuthzPlugin(
  server: Hapi.Server,
  firebaseApp: admin.app.App
): Promise<void> {
  await server.register({
    plugin: pluginFirebaseUsers,
    options: {
      logger: console,
      serviceAccount: firebaseApp,
      passwordPolicy: customPasswordPolicy,
      strategies: [
        {
          actionName: 'list',
          strategy: 'firebase',
          scope: 'list:user',
        },
      ],
      routePrefix: '/api',
    },
  });
}
