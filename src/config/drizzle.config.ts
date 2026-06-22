import { defineConfig } from 'drizzle-kit'
import { SQLITE_DB_FILE_NAME } from './index.js'

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schemas/sqlite.ts',
  dialect: 'sqlite',
  dbCredentials: {
    url: SQLITE_DB_FILE_NAME,
  },
})
