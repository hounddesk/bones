# `@hounddesk/firebase-users`

Firebase users plugin for Hapi

## Available endpoints

### Create user

### Delete user

### Get user by Id

### Get user by Email

### Get user by Phone number

### Update user

### Create claim

### List users

## Adding authorization

You can customize the authorization strategy for each specific endpoint, if you leave the strategy empty for all or any specific route, the endpoint will not require authorization.

The plugin receives a strategies property that you can use for control how each endpoint is being authorized.

Example:
Use firebase authorization strategy and require delete:user scopes for deleting an user

```
{
    actionName: 'delete',
    strategy: 'firebase',
    scope: 'delete:user',
}

```

You can specify multiple scopes if you want (following the same behavior for Hapi routes authorization mechanism)

```
{
    actionName: 'delete',
    strategy: 'firebase',
    scope: ['+delete:user', '+admin'],
}

```

## Usage

```
import Hapi from '@hapi/hapi';
import { ServiceAccount } from 'firebase-admin';
import pluginFirebaseUsers from '@hounddesk/plugin-firebase-users';

// Initialize your firebase application using the sdk
const firebaseApp = admin.initializeApp(...);

// Register the plugin
await server.register({
    plugin: pluginFirebaseUsers,
    options: {
      logger: console,
      serviceAccount: firebaseApp,
      strategies: [
        {
          actionName: 'list',
          strategy: 'firebase',
          scope: 'list:user',
        },
      ],
      routePrefix: '/api',
    },
  });
```
