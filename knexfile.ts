import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ quiet: true });

const config = {
  development: {
    client: 'postgresql',
    connection: {
      host: process.env.POSTGRES_HOST || 'postgres',
      port: parseInt(process.env.POSTGRES_PORT || '5432'),
      database: process.env.POSTGRES_DB || 'shamebell',
      user: process.env.POSTGRES_USER || 'postgres',
      password: process.env.POSTGRES_PASSWORD || 'password',
    },
    migrations: {
      directory: resolve(__dirname, 'src', 'infrastructure', 'knex', 'migrations'),
    },
    seeds: {
      directory: resolve(__dirname, 'src', 'infrastructure', 'knex', 'seeds'),
    },
  },
  production: {
    client: 'postgresql',
    connection: {
      host: process.env.POSTGRES_HOST || 'postgres',
      port: parseInt(process.env.POSTGRES_PORT || '5432'),
      database: process.env.POSTGRES_DB || 'shamebell',
      user: process.env.POSTGRES_USER || 'postgres',
      password: process.env.POSTGRES_PASSWORD || 'password',
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: resolve(__dirname, 'src', 'infrastructure', 'knex', 'migrations'),
    },
    seeds: {
      directory: resolve(__dirname, 'src', 'infrastructure', 'knex', 'seeds'),
    },
  },
  test: {
    client: 'sqlite3',
    connection: {
      filename: resolve(__dirname, 'test.sqlite3'),
    },
    useNullAsDefault: true,
    migrations: {
      directory: resolve(__dirname, 'src', 'infrastructure', 'knex', 'migrations'),
    },
    seeds: {
      directory: resolve(__dirname, 'src', 'infrastructure', 'knex', 'seeds'),
    },
  },
};

export default config;
