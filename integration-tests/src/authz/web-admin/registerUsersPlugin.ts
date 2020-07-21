import Hapi from '@hapi/hapi';
import Joi from '@hapi/joi';
import Boom from '@hapi/boom';
import * as admin from 'firebase-admin';
import pluginFirebaseUsers from '@hounddesk/plugin-firebase-users';
import customPasswordPolicy from '../../passwordPolicy';
import {
  User,
  UserSigninResult,
} from '@hounddesk/plugin-firebase-users/lib/types';

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

async function afterGetUser(
  request: Hapi.Request,
  h: Hapi.ResponseToolkit,
  response: User
): Promise<unknown> {
  // You can call any other extra source here in order to enhance the response!
  return response;
}

async function afterUpdateUser(
  request: Hapi.Request,
  h: Hapi.ResponseToolkit,
  response: User
): Promise<User> {
  // You can call any other extra source here after a user is deleted
  return response;
}

async function afterCreateUser(
  request: Hapi.Request,
  h: Hapi.ResponseToolkit,
  response: User
): Promise<User> {
  // You can call any other extra source here after a user is deleted
  return response;
}

async function afterUserSignin(
  request: Hapi.Request,
  h: Hapi.ResponseToolkit,
  response: UserSigninResult
): Promise<UserSigninResult> {
  // You can call any other extra source here after a user signed in successfuly
  return response;
}

export default async function registerUsersPlugin(
  server: Hapi.Server,
  firebaseApp: admin.app.App
): Promise<void> {
  await server.register({
    plugin: pluginFirebaseUsers,
    options: {
      isPublicAPI: false,
      logger: console,
      serviceAccount: firebaseApp,
      passwordPolicy: customPasswordPolicy,
      beforeCreateUser: checkPassport,
      afterGetUser,
      afterCreateUser,
      afterUpdateUser,
      afterUserSignin,
      signin_url:
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=<Your_Key>',
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
      routePrefix: '/web-admin/api',
    },
  });
}
