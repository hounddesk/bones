import * as admin from 'firebase-admin';
export const loggerMocks = {
  log: jest.fn(),
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
};

export function firebaseApp(authMock: jest.Mock): admin.app.App {
  return {
    name: '',
    options: {},
    firestore: authMock,
    securityRules: authMock,
    storage: authMock,
    delete: authMock,
    remoteConfig: authMock,
    projectManagement: authMock,
    messaging: authMock,
    machineLearning: authMock,
    instanceId: authMock,
    database: authMock,
    auth: authMock,
  };
}
