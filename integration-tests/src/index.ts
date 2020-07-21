import initializeFirebase from './initializeFirebase';
import initializeServer from './initializeServer';
import registerAuthzPlugin from './registerAuthzPlugin';
import registerUsersPluginMobileApp from './authz/mobile-app/registerUsersPlugin';
import registerUsersPluginWebAdminApp from './authz/web-admin/registerUsersPlugin';

(async function startServer() {
  // Initialize Firebase SDK
  const firebaseApp = initializeFirebase();
  // Initialize Hapi Server
  const server = initializeServer();
  // Register authorization strategy (Firebase JWT)
  await registerAuthzPlugin(server, firebaseApp);
  // Register user management endpoints
  // You can now do things like: create, delete, update, get users by default
  // Should support multiple times the same plugin registration
  await registerUsersPluginMobileApp(server, firebaseApp);
  await registerUsersPluginWebAdminApp(server, firebaseApp);
  // Start the server
  await server.start();
  console.log(`Server running ${server.info.uri}`);
})();
