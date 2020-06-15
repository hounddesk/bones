/**
 * Authorization headers
 */

export interface AuthorizationHeader {
  authenticationScheme: string;
  credentials: string;
}

export type BearerToken = AuthorizationHeader;

export enum SupportedAuthorizationHeader {
  BearerToken,
}
