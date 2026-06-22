import { createClient } from '@libsql/client'
import { drizzle as sqliteDrizzle } from 'drizzle-orm/libsql'
import { SQLITE_DB_FILE_NAME } from '../config/index.js'

const client = createClient({ url: SQLITE_DB_FILE_NAME })
export const sqlite = sqliteDrizzle({ client })
