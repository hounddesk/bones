import hapi from '@hapi/hapi';

export interface HapiPlugin<T> {
  name: string;
  register(server: hapi.Server, options?: T | undefined): void;
  multiple: boolean;
}

export interface HapiAuthStrategy {
  strategy: string;
  scope: string | Array<string>;
}

export interface Logger {
  log(message: string, extras?: string): void;
  info(message: string, extras?: string): void;
  error(message: string, extras?: string): void;
  debug(message: string, extras?: string): void;
  warn(message: string, extras?: string): void;
}
