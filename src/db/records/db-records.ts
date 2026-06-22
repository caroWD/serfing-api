import { createClient } from '@libsql/client'
import { drizzle } from 'drizzle-orm/libsql'
import { SQLITE_DB_FILE_NAME } from '../../config/index.js'
import {
  sqliteAccountantPositionsTable,
  sqliteBusinessAreasTable,
  sqliteContractTypesTable,
  sqliteEducationDegreesTable,
  sqliteEngineerPositionsTable,
  sqliteHierarciesTable,
  sqliteOperatorTypesTable,
  sqlitePermissionsTable,
  sqliteRolePermissionsTable,
  sqliteRolesTable,
  sqliteSaleTypesTable,
  sqliteUsersTable,
} from '../schemas/sqlite.js'
import {
  sqliteAccountantPositionsRecords,
  sqliteBusinessAreasRecords,
  sqliteContractTypesRecords,
  sqliteEducationDegreesRecords,
  sqliteEngineerPositionsRecords,
  sqliteHierarciesRecords,
  sqliteOperatorTypesRecords,
  sqlitePermissionsRecords,
  sqliteRolePermissionsRecords,
  sqliteRolesRecords,
  sqliteSaleTypesRecords,
  sqliteUsersRecords,
} from './sqlite/index.js'

const client = createClient({ url: SQLITE_DB_FILE_NAME })
const db = drizzle({ client })

const main = async (): Promise<void> => {
  await db.insert(sqlitePermissionsTable).values(sqlitePermissionsRecords)

  await db.insert(sqliteRolesTable).values(sqliteRolesRecords)

  await db
    .insert(sqliteRolePermissionsTable)
    .values(sqliteRolePermissionsRecords)

  await db
    .insert(sqliteAccountantPositionsTable)
    .values(sqliteAccountantPositionsRecords)

  await db.insert(sqliteBusinessAreasTable).values(sqliteBusinessAreasRecords)

  await db.insert(sqliteContractTypesTable).values(sqliteContractTypesRecords)

  await db
    .insert(sqliteEngineerPositionsTable)
    .values(sqliteEngineerPositionsRecords)

  await db.insert(sqliteHierarciesTable).values(sqliteHierarciesRecords)

  await db.insert(sqliteOperatorTypesTable).values(sqliteOperatorTypesRecords)

  await db.insert(sqliteSaleTypesTable).values(sqliteSaleTypesRecords)

  await db
    .insert(sqliteEducationDegreesTable)
    .values(sqliteEducationDegreesRecords)

  await db.insert(sqliteUsersTable).values(sqliteUsersRecords)
}

main()
