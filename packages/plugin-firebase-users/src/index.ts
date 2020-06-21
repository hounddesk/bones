import Hapi from '@hapi/hapi';
import Joi from '@hapi/joi';
/** Types */
import {
  FirebaseUsersPluginOptions,
  UserAction,
  ClaimAction,
  AuthStrategy,
} from './types';
import { HapiAuthStrategy, HapiPlugin } from '@hounddesk/bones-types';
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

export function filterAction(
  actionName: string,
  strategies?: Array<AuthStrategy> | undefined
): AuthStrategy | undefined {
  return strategies?.filter((s) => s.actionName === actionName)[0];
}

export function getStrategy(
  actionName: string,
  strategies?: Array<AuthStrategy> | undefined
): HapiAuthStrategy | undefined {
  const filteredStrategy = filterAction(actionName, strategies);
  return filteredStrategy
    ? { strategy: filteredStrategy.strategy, scope: filteredStrategy.scope }
    : undefined;
}

const pluginFirebaseUsers: HapiPlugin<FirebaseUsersPluginOptions> = {
  name: 'plugin-firebase-users',
  register: function (
    server: Hapi.Server,
    options: FirebaseUsersPluginOptions
  ): void {
    const routePrefix = options.routePrefix || '';

    const nop = (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
      return h.continue;
    };

    server.route({
      method: 'POST',
      path: `${routePrefix}/users`,
      options: {
        auth: getStrategy(UserAction.Create, options.strategies) || false,
        validate: {
          payload: UserSchema,
        },
        pre: [
          { method: () => options.serviceAccount, assign: 'firebase' },
          {
            method: options.passwordPolicy || nop,
          },
        ],
      },
      handler: createUser,
    });
    server.route({
      method: 'POST',
      path: `${routePrefix}/users/{uid}/claims`,
      options: {
        auth: getStrategy(ClaimAction.Create, options.strategies) || false,
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
        auth: getStrategy(UserAction.Delete, options.strategies) || false,
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
        auth: getStrategy(UserAction.Update, options.strategies) || false,
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
        auth: getStrategy(UserAction.GetById, options.strategies) || false,
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
          getStrategy(UserAction.GetById, options.strategies) ||
          getStrategy(UserAction.GetByEmail, options.strategies) ||
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
          getStrategy(UserAction.GetById, options.strategies) ||
          getStrategy(UserAction.GetByEmail, options.strategies) ||
          getStrategy(UserAction.GetByPhone, options.strategies) ||
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
        auth: getStrategy(UserAction.List, options.strategies) || false,
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

export default pluginFirebaseUsers;