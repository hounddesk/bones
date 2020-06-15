import hapi from '@hapi/hapi';
import FirebaseAdmin from 'firebase-admin';
export interface HapiPlugin {
    name: string;
    register(server: hapi.Server, options?: unknown | undefined): void;
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
export interface AuthStrategy {
    actionName: string;
    strategy: string;
    scope: string | Array<string>;
}
export interface HapiAuthStrategy {
    strategy: string;
    scope: string | Array<string>;
}
export interface FirebaseAuthzPluginOptions {
    logger: Logger;
    serviceAccount: FirebaseAdmin.app.App;
    userClaims?: Array<string>;
    schemeName?: string;
}
export interface FirebaseUsersPluginOptions {
    logger: Logger;
    serviceAccount: FirebaseAdmin.app.App;
    strategies?: Array<AuthStrategy>;
    routePrefix?: string;
    passwordPolicy?(request: hapi.Request, h: hapi.ResponseToolkit): unknown;
}
export interface Logger {
    log(message: string, extras: string): void;
    info(message: string, extras: string): void;
    error(message: string, extras: string): void;
    debug(message: string, extras: string): void;
    warn(message: string, extras: string): void;
}
