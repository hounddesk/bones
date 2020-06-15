import hapi from '@hapi/hapi';

export interface HapiPlugin {
  name: string;
  register(server: hapi.Server, options?: unknown | undefined): void;
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

export interface Logger {
  log(message: string, extras: string): void;
  info(message: string, extras: string): void;
  error(message: string, extras: string): void;
  debug(message: string, extras: string): void;
  warn(message: string, extras: string): void;
}
