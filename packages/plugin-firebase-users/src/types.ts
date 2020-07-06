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
  signin_url?: string;
  passwordPolicy?(request: Hapi.Request, h: Hapi.ResponseToolkit);
  beforeCreateUser?(request: Hapi.Request, h: Hapi.ResponseToolkit);
  beforeUpdateUser?(request: Hapi.Request, h: Hapi.ResponseToolkit);
  beforeDeleteUser?(request: Hapi.Request, h: Hapi.ResponseToolkit);
  beforeGetUser?(request: Hapi.Request, h: Hapi.ResponseToolkit);
  afterGetUser?(
    request: Hapi.Request,
    h: Hapi.ResponseToolkit,
    response: unknown
  );
  afterCreateUser?(
    request: Hapi.Request,
    h: Hapi.ResponseToolkit,
    response: unknown
  );
  afterUpdateUser?(
    request: Hapi.Request,
    h: Hapi.ResponseToolkit,
    response: unknown
  );
  afterDeleteUser?(
    request: Hapi.Request,
    h: Hapi.ResponseToolkit,
    response: unknown
  );
  afterUserSignin?(
    request: Hapi.Request,
    h: Hapi.ResponseToolkit,
    response: unknown
  );
}

export interface UserSignin {
  email: string;
  password: string;
}

export interface UserSigninError {
  code: number;
  message: string;
}

export interface UserSigninResult {
  error?: UserSigninError;
}
