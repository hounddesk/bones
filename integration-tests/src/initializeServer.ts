import Hapi from '@hapi/hapi';
import Joi from '@hapi/joi';
import config from './configuration';

export default function initializeServer(): Hapi.Server {
  const server = Hapi.server({
    host: config.get('server').host,
    port: config.get('server').port,
  });
  server.validator(Joi);
  return server;
}
