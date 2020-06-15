import Hapi from '@hapi/hapi';
import Joi from '@hapi/joi';
/** Types */
import { FirebaseUsersPluginOptions } from './types';
import { AuthStrategy, HapiAuthStrategy } from '@hounddesk/bones-types';
/** Schemas */
import UserSchema from './schemas/user';
/** Controllers */
import {
  createUser,
  deleteUser,
  updateUser,
  getUser,
  listUsers,
  setCustomUserClaims,
} from './userController';

export function getStrategy(
  actionName: string,
  strategies?: Array<AuthStrategy> | undefined
): HapiAuthStrategy | undefined {
  const filteredStrategy = strategies?.filter(
    (s) => s.actionName === actionName
  )[0];
  return filteredStrategy
    ? { strategy: filteredStrategy.strategy, scope: filteredStrategy.scope }
    : undefined;
}

const firebaseUsers = {
  name: 'hapi-firebase-users',
  register: function (
    server: Hapi.Server,
    options: FirebaseUsersPluginOptions
  ): void {
    const routePrefix = options.routePrefix || '';
    const nop = () => {
      return;
    };
    server.route({
      method: 'POST',
      path: `${routePrefix}/users`,
      options: {
        auth: getStrategy('create', options.strategies) || false,
        validate: {
          payload: UserSchema,
        },
        pre: [
          {
            method: () => options.passwordPolicy || nop,
          },
          { method: () => options.serviceAccount, assign: 'firebase' },
        ],
      },
      handler: createUser,
    });
    server.route({
      method: 'POST',
      path: `${routePrefix}/users/{uid}/claims`,
      options: {
        auth: getStrategy('claims', options.strategies) || false,
        validate: {
          params: {
            uid: Joi.string().required(),
          },
          payload: {
            claims: Joi.array().items(Joi.string()).min(1),
          },
        },
        pre: [{ method: () => options.serviceAccount, assign: 'firebase' }],
      },
      handler: setCustomUserClaims,
    });
    server.route({
      method: 'DELETE',
      path: `${routePrefix}/users/{uid}`,
      options: {
        auth: getStrategy('delete', options.strategies) || false,
        validate: {
          params: {
            uid: Joi.string().required(),
          },
        },
        pre: [{ method: () => options.serviceAccount, assign: 'firebase' }],
      },
      handler: deleteUser,
    });
    server.route({
      method: 'PATCH',
      path: `${routePrefix}/users/{uid}`,
      options: {
        auth: getStrategy('update', options.strategies) || false,
        validate: {
          params: {
            uid: Joi.string().required(),
          },
          payload: UserSchema,
        },
        pre: [{ method: () => options.serviceAccount, assign: 'firebase' }],
      },
      handler: updateUser,
    });

    server.route({
      method: 'GET',
      path: `${routePrefix}/users/{uid}`,
      options: {
        auth: getStrategy('get', options.strategies) || false,
        validate: {
          params: {
            uid: Joi.string().required(),
          },
        },
        pre: [{ method: () => options.serviceAccount, assign: 'firebase' }],
      },
      handler: getUser.byId,
    });

    server.route({
      method: 'GET',
      path: `${routePrefix}/users/email/{email}`,
      options: {
        auth:
          getStrategy('get', options.strategies) ||
          getStrategy('getByEmail', options.strategies) ||
          false,
        validate: {
          params: {
            email: Joi.string().required(),
          },
        },
        pre: [{ method: () => options.serviceAccount, assign: 'firebase' }],
      },
      handler: getUser.byEmail,
    });

    server.route({
      method: 'GET',
      path: `${routePrefix}/users/phone/{phoneNumber}`,
      options: {
        auth:
          getStrategy('get', options.strategies) ||
          getStrategy('getByEmail', options.strategies) ||
          getStrategy('getByPhoneNumber', options.strategies) ||
          false,
        validate: {
          params: {
            phoneNumber: Joi.string().required(),
          },
        },
        pre: [{ method: () => options.serviceAccount, assign: 'firebase' }],
      },
      handler: getUser.byPhoneNumber,
    });

    server.route({
      method: 'GET',
      path: `${routePrefix}/users/list`,
      options: {
        auth: getStrategy('list', options.strategies) || false,
        validate: {
          query: {
            limit: Joi.number().default(10),
            pageToken: Joi.string(),
          },
        },
        pre: [{ method: () => options.serviceAccount, assign: 'firebase' }],
      },
      handler: listUsers,
    });
  },
};

export default firebaseUsers;
