import 'dotenv/config'
import './dotenv.config.js'

export const {
  NODE_ENV = 'development',
  PORT = '3000',
  ACCEPTED_ORIGINS = 'http://localhost:4000',
  SQLITE_DB_FILE_NAME = 'file:path/to/db-file.db',
  USER_ADMIN_PASSWORD = 'Pass123/*',
  USER_SUPPORT_PASSWORD = 'Pass456/*',
  SALT_ROUNDS = '10',
  MYSQL_DB_HOST = 'localhost',
  MYSQL_DB_USER = 'root',
  MYSQL_DB_PASSWORD = 'root',
  MYSQL_DB = 'db_name',
  JWT_SECRET = 'a-string-secret-at-least-256-bits-long',
  JWT_ALG = 'HS256',
  JWT_ISSUER = 'urn:example:issuer',
  JWT_CLAIM = 'urn:example:claim',
} = process.env
