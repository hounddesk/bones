import Hapi from '@hapi/hapi';
import hapiFirebasePlugin from '../src/index';
import { loggerMocks } from './mocks';

describe('Hapi Firebase plugin test suite', () => {
  describe('When an access token is not provided', () => {
    it('it should Unauthorized the request', async () => {
      const server = Hapi.server();
      await server.register({
        plugin: hapiFirebasePlugin,
        options: {
          serviceAccount: {},
          logger: loggerMocks,
        },
      });
      server.auth.strategy('firebase', 'firebase');
      const testRoute = {
        method: 'GET',
        path: '/api/test',
        options: {
          auth: {
            strategy: 'firebase',
            scope: ['admin'],
          },
        },
        handler: function () {
          return 'it works';
        },
      };
      server.route(testRoute);
      const response = await server.inject('/api/test');
      expect(response.statusCode).toEqual(401);
      expect(response.statusMessage).toEqual('Unauthorized');
    });
  });

  describe('When an access token is provided', () => {
    it('it should authorized the request when the scope is available', async () => {
      const authMock = jest.fn();
      const verifyIdTokenMock = jest.fn();
      const expectedDecodedToken = {
        user_id: 1,
        email: 'john.doe@gmail.com',
        email_verified: false,
        admin: true,
        user: false,
      };
      verifyIdTokenMock.mockReturnValue(expectedDecodedToken);
      authMock.mockReturnValue({
        verifyIdToken: verifyIdTokenMock,
      });
      const server = Hapi.server();
      await server.register({
        plugin: hapiFirebasePlugin,
        options: {
          serviceAccount: {
            auth: authMock,
          },
          logger: loggerMocks,
          userClaims: ['admin'],
        },
      });
      server.auth.strategy('firebase', 'firebase');
      const testRoute = {
        method: 'GET',
        path: '/api/test',
        options: {
          auth: {
            strategy: 'firebase',
            scope: ['admin'],
          },
        },
        handler: function () {
          return 'it works';
        },
      };
      server.route(testRoute);
      const response = await server.inject({
        url: '/api/test',
        headers: {
          Authorization: 'Bearer xxxx',
        },
      });

      expect(response.statusCode).toEqual(200);
      expect(response.statusMessage).toEqual('OK');
      expect(response.result).toEqual('it works');
    });
    it('it should Unauthorized the request when the scope is disabled', async () => {
      const authMock = jest.fn();
      const verifyIdTokenMock = jest.fn();
      const expectedDecodedToken = {
        user_id: 1,
        email: 'john.doe@gmail.com',
        email_verified: false,
        admin: false,
        user: false,
      };
      verifyIdTokenMock.mockReturnValue(expectedDecodedToken);
      authMock.mockReturnValue({
        verifyIdToken: verifyIdTokenMock,
      });
      const server = Hapi.server();
      await server.register({
        plugin: hapiFirebasePlugin,
        options: {
          serviceAccount: {
            auth: authMock,
          },
          logger: loggerMocks,
          userClaims: ['admin'],
        },
      });
      server.auth.strategy('firebase', 'firebase');
      const testRoute = {
        method: 'GET',
        path: '/api/test',
        options: {
          auth: {
            strategy: 'firebase',
            scope: ['admin'],
          },
        },
        handler: function () {
          return 'it works';
        },
      };
      server.route(testRoute);
      const response = await server.inject({
        url: '/api/test',
        headers: {
          Authorization: 'Bearer xxxx',
        },
      });

      expect(response.statusCode).toEqual(403);
      expect(response.statusMessage).toEqual('Forbidden');
    });
    it('it should Unauthorized the request when the scope is not available', async () => {
      const authMock = jest.fn();
      const verifyIdTokenMock = jest.fn();
      const expectedDecodedToken = {
        user_id: 1,
        email: 'john.doe@gmail.com',
        email_verified: false,
      };
      verifyIdTokenMock.mockReturnValue(expectedDecodedToken);
      authMock.mockReturnValue({
        verifyIdToken: verifyIdTokenMock,
      });
      const server = Hapi.server();
      await server.register({
        plugin: hapiFirebasePlugin,
        options: {
          serviceAccount: {
            auth: authMock,
          },
          logger: loggerMocks,
          userClaims: ['admin'],
        },
      });
      server.auth.strategy('firebase', 'firebase');
      const testRoute = {
        method: 'GET',
        path: '/api/test',
        options: {
          auth: {
            strategy: 'firebase',
            scope: ['admin'],
          },
        },
        handler: function () {
          return 'it works';
        },
      };
      server.route(testRoute);
      const response = await server.inject({
        url: '/api/test',
        headers: {
          Authorization: 'Bearer xxxx',
        },
      });

      expect(response.statusCode).toEqual(403);
      expect(response.statusMessage).toEqual('Forbidden');
    });
  });
});
