import Hapi from '@hapi/hapi';
import FirebaseAdmin from 'firebase-admin';
import { Logger } from '@hounddesk/bones-types';
import Joi from '@hapi/joi';

export enum UserAction {
  Create = 'create',
  Delete = 'delete',
  Update = 'update',
  GetById = 'get',
  GetByEmail = 'getByEmail',
  GetByPhone = 'getByPhoneNumber',
  List = 'list',
}

export enum ClaimAction {
  Create = 'create',
  Delete = 'delete',
}

export interface AuthStrategy {
  actionName: string;
  strategy: string;
  scope: string | Array<string>;
}
export interface PasswordValidator {
  validate(password: string): boolean;
}

export interface CustomClaims {
  name: string;
  value: boolean;
}

export interface User {
  uid: string;
  email: string;
  phoneNumber: string;
  displayName: string;
  photoURL: string;
  disabled: boolean;
  password: string;
  claims?: Record<string, unknown>;
  extras?: Record<string, unknown>;
}

export interface FirebaseUsersPluginOptions {
  logger: Logger;
  serviceAccount: FirebaseAdmin.app.App;
  strategies?: Array<AuthStrategy>;
  routePrefix?: string;
  extrasSchema?: Joi.SchemaLike;
  isPublicAPI?: boolean;
  passwordPolicy?(request: Hapi.Request, h: Hapi.ResponseToolkit);
  beforeUserCreate?(request: Hapi.Request, h: Hapi.ResponseToolkit);
}
