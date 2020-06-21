import * as admin from 'firebase-admin';
import config from './configuration';

export default function initializeFirebase(): admin.app.App {
  const firebaseCredentials: admin.ServiceAccount = {
    projectId: config.get('firebase.projectId'),
    privateKey: config.get('firebase.privateKey'),
    clientEmail: config.get('firebase.clientEmail'),
  };
  return admin.initializeApp({
    credential: admin.credential.cert(firebaseCredentials),
  });
}
