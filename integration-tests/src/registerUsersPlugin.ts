import Hapi from '@hapi/hapi';
import Joi from '@hapi/joi';
import Boom from '@hapi/boom';
import * as admin from 'firebase-admin';
import pluginFirebaseUsers from '@hounddesk/plugin-firebase-users';
import customPasswordPolicy from './passwordPolicy';
import { User } from '@hounddesk/plugin-firebase-users/lib/types';

function checkPassport(
  request: Hapi.Request,
  h: Hapi.ResponseToolkit
): unknown {
  const user = request.payload as User;
  if (user.extras && user.extras.passport == 'NA000') {
    return Boom.badRequest('The passport is already in use');
  }
  return h.continue;
}

export default async function registerUsersPlugin(
  server: Hapi.Server,
  firebaseApp: admin.app.App
): Promise<void> {
  await server.register({
    plugin: pluginFirebaseUsers,
    options: {
      logger: console,
      serviceAccount: firebaseApp,
      passwordPolicy: customPasswordPolicy,
      beforeUserCreate: checkPassport,
      extrasSchema: Joi.object({
        passport: Joi.string().min(2),
      }),
      strategies: [
        {
          actionName: 'list',
          strategy: 'firebase',
          scope: 'list:users',
        },
      ],
      routePrefix: '/api',
    },
  });
}
