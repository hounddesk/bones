import * as admin from 'firebase-admin';
export function firebaseApp(
  authMock: jest.Mock,
  firestoreMock: jest.Mock
): admin.app.App {
  return {
    name: '',
    options: {},
    firestore: firestoreMock,
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
