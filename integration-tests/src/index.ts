import initializeFirebase from './initializeFirebase';
import initializeServer from './initializeServer';
import registerAuthzPlugin from './registerAuthzPlugin';
import registerUsersPlugin from './registerUsersPlugin';

(async function startServer() {
  // Initialize Firebase SDK
  const firebaseApp = initializeFirebase();
  // Initialize Hapi Server
  const server = initializeServer();
  // Register authorization strategy (Firebase JWT)
  await registerAuthzPlugin(server, firebaseApp);
  // Register user management endpoints
  // You can now do things like: create, delete, update, get users by default
  await registerUsersPlugin(server, firebaseApp);
  // Start the server
  await server.start();
  console.log(`Server running ${server.info.uri}`);
})();
