import { getCredentials } from '../src/plugin';
import { FirebaseAuthzPluginOptions } from '../src/types';
import { loggerMocks } from './mocks';
describe('firebase-plugin Test Suite', () => {
  describe('Credentials', () => {
    it('should verify the id token and create the proper credentials', async () => {
      const authMock = jest.fn();
      const verifyIdTokenMock = jest.fn();

      const expectedDecodedToken = {
        user_id: 1,
        email: 'john.doe@gmail.com',
        email_verified: false,
        admin: true,
        user: false,
      };

      const { user_id, email_verified, email } = expectedDecodedToken;

      const expectedCredentials = {
        user: { userId: user_id, emailVerified: email_verified, email },
        scope: ['admin'],
      };

      const settingsMock: FirebaseAuthzPluginOptions = {
        logger: loggerMocks,
        serviceAccount: {
          name: '',
          options: {},
          auth: authMock,
          database: jest.fn(),
          firestore: jest.fn(),
          instanceId: jest.fn(),
          machineLearning: jest.fn(),
          messaging: jest.fn(),
          projectManagement: jest.fn(),
          remoteConfig: jest.fn(),
          securityRules: jest.fn(),
          storage: jest.fn(),
          delete: jest.fn(),
        },
        userClaims: ['admin'],
      };
      verifyIdTokenMock.mockReturnValue(expectedDecodedToken);
      authMock.mockReturnValue({
        verifyIdToken: verifyIdTokenMock,
      });
      const authorizationHeader = 'Bearer xxxxx';
      const credentials = await getCredentials(
        authorizationHeader,
        settingsMock
      );
      expect(settingsMock.serviceAccount.auth).toBeCalledTimes(1);
      expect(credentials).toStrictEqual(expectedCredentials);
    });
  });
});
