import Hapi from '@hapi/hapi';
import Joi, { func } from '@hapi/joi';
import pluginFirebaseUsers from '../src/index';
import { firebaseApp } from './mocks';
interface CustomUser {
  passport: string;
}

describe('Firebase users Test suite', () => {
  it('should create an user with a valid schema', async () => {
    const extraFieldsSchema = Joi.object<CustomUser>({
      passport: Joi.string(),
    });

    const server = Hapi.server();
    server.validator(Joi);
    const createUserMock = jest.fn();
    const userMock = {
      uid: '43024892304-34234',
      email: 'john.doe@email.com',
      password: '123456',
    };
    createUserMock.mockReturnValue(userMock);
    const authMock = jest.fn();
    const firestoreMock = jest.fn();
    const setMock = jest.fn();
    authMock.mockReturnValue({
      createUser: createUserMock,
    });
    firestoreMock.mockReturnValue({
      collection: function () {
        return {
          doc: function () {
            return {
              set: setMock,
            };
          },
        };
      },
    });
    await server.register({
      plugin: pluginFirebaseUsers,
      options: {
        logger: console,
        serviceAccount: firebaseApp(authMock, firestoreMock),
        extrasSchema: extraFieldsSchema,
        routePrefix: '/api',
      },
    });

    const response = await server.inject({
      method: 'POST',
      url: '/api/users',
      payload: {
        email: 'john.doe@email.com',
        password: '123456',
        extras: {
          passport: 'uer-2323',
        },
      },
    });
    const expectedUser = {
      uid: userMock.uid,
      password: '123456',
      email: 'john.doe@email.com',
      passport: 'uer-2323',
    };
    expect(response.statusCode).toEqual(200);
    expect(JSON.parse(response.payload)).toEqual(expectedUser);
  });

  it('should NOT create an user with an invalid extended schema', async () => {
    const extraFieldsSchema = Joi.object<CustomUser>({
      passport: Joi.string(),
    });

    const server = Hapi.server();
    server.validator(Joi);
    const createUserMock = jest.fn();
    const userMock = {
      uid: '43024892304-34234',
      email: 'john.doe@email.com',
      password: '123456',
    };
    createUserMock.mockReturnValue(userMock);
    const authMock = jest.fn();
    const firestoreMock = jest.fn();
    const setMock = jest.fn();
    authMock.mockReturnValue({
      createUser: createUserMock,
    });
    firestoreMock.mockReturnValue({
      collection: function () {
        return {
          doc: function () {
            return {
              set: setMock,
            };
          },
        };
      },
    });
    await server.register({
      plugin: pluginFirebaseUsers,
      options: {
        logger: console,
        serviceAccount: firebaseApp(authMock, firestoreMock),
        extrasSchema: extraFieldsSchema,
        routePrefix: '/api',
      },
    });

    const response = await server.inject({
      method: 'POST',
      url: '/api/users',
      payload: {
        email: 'john.doe@email.com',
        password: '123456',
        extras: {
          invalid_field: 'uer-2323',
        },
      },
    });
    expect(response.statusCode).toEqual(400);
  });
});
