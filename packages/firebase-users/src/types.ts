import hapi from '@hapi/hapi';
import FirebaseAdmin from 'firebase-admin';
import { Logger, AuthStrategy } from '@hounddesk/bones-types';

export interface PasswordValidator {
  validate(password: string): boolean;
}
export interface User {
  uid: string;
  email: string;
  phoneNumber: string;
  displayName: string;
  photoURL: string;
  disabled: boolean;
  password: string;
  claims?: Array<string> | undefined;
}

export interface FirebaseUsersPluginOptions {
  logger: Logger;
  serviceAccount: FirebaseAdmin.app.App;
  strategies?: Array<AuthStrategy>;
  routePrefix?: string;
  passwordPolicy?(request: hapi.Request, h: hapi.ResponseToolkit): unknown;
}
