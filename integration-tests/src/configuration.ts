import convict from 'convict';
import dotenv from 'dotenv';
dotenv.config();
if (process.env.FIREBASE_PRIVATE_KEY) {
  process.env.FIREBASE_PRIVATE_KEY = process.env.FIREBASE_PRIVATE_KEY.replace(
    /\\n/g,
    '\n'
  );
}

export interface Firebase {
  projectId: string;
  privateKey: string;
  clientEmail: string;
}

export interface Server {
  host: string;
  port: number;
}

export interface Configuration {
  firebase: Firebase;
  server: Server;
  environment: string;
}
export default convict<Configuration>({
  firebase: {
    projectId: {
      format: '*',
      default: '',
      env: 'FIREBASE_PROJECT_ID',
    },
    privateKey: {
      format: '*',
      env: 'FIREBASE_PRIVATE_KEY',
      default: '',
      sensitive: true,
    },
    clientEmail: {
      format: String,
      env: 'FIREBASE_CLIENT_EMAIL',
      default: '',
      sensitive: true,
    },
  },
  server: {
    port: {
      format: Number,
      default: 8080,
      env: 'SERVER_PORT',
    },
    host: {
      format: String,
      default: 'localhost',
      env: 'SERVER_HOST',
    },
  },
  environment: {
    format: String,
    default: 'development',
  },
});
