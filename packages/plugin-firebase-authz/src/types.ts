import FirebaseAdmin from 'firebase-admin';
import { Logger } from '@hounddesk/bones-types';
export interface FirebaseAuthzPluginOptions {
  logger: Logger;
  serviceAccount: FirebaseAdmin.app.App;
  userClaims?: Array<string>;
  schemeName?: string;
}

export interface UserCredential {
  userId?: string;
  email?: string;
  emailVerified?: boolean;
}

export interface Credential {
  user: UserCredential;
  scope: Array<string>;
}
