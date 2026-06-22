import { primaryKey, sqliteTable, text, real } from 'drizzle-orm/sqlite-core'
import { sql } from 'drizzle-orm'

export const sqlitePermissionsTable = sqliteTable('permissions', {
  id: text('id', { mode: 'text', length: 36 }).primaryKey(),
  name: text('text', { mode: 'text', length: 100 }).notNull().unique(),
  description: text('description', { mode: 'text', length: 255 }).notNull(),
})

export const sqliteRolesTable = sqliteTable('roles', {
  id: text('id', { mode: 'text', length: 36 }).primaryKey(),
  name: text('name', { mode: 'text', length: 100 }).notNull().unique(),
  description: text('description', { mode: 'text', length: 255 }).notNull(),
})

export const sqliteRolePermissionsTable = sqliteTable(
  'role_permissions',
  {
    roleId: text('role_id', { mode: 'text', length: 36 })
      .notNull()
      .references(() => sqliteRolesTable.id),
    permissionId: text('permission_id', { mode: 'text', length: 36 })
      .notNull()
      .references(() => sqlitePermissionsTable.id),
  },
  (table) => [
    primaryKey({
      name: 'pk_role_permissions',
      columns: [table.roleId, table.permissionId],
    }),
  ]
)

export const sqliteUsersTable = sqliteTable('users', {
  id: text('id', { mode: 'text', length: 36 }).primaryKey(),
  handle: text('handle', { mode: 'text', length: 60 }).notNull().unique(),
  firstName: text('first_name', { mode: 'text', length: 80 }).notNull(),
  lastName: text('last_name', { mode: 'text', length: 80 }).notNull(),
  email: text('email', { mode: 'text', length: 150 }).notNull().unique(),
  password: text('password', { mode: 'text', length: 60 }).notNull(),
  state: text('state', {
    mode: 'text',
    enum: ['pending', 'enabled', 'disabled'],
  })
    .notNull()
    .default('pending'),
  roleId: text('role_id', { mode: 'text', length: 36 })
    .notNull()
    .references(() => sqliteRolesTable.id),
  createdAt: text('created_at')
    .notNull()
    .default(sql`(CURRENT_DATE)`),
  updatedAt: text('updated_at', { mode: 'text', length: 40 })
    .notNull()
    .default(sql`(CURRENT_DATE)`),
  deletedAt: text('deleted_at', { mode: 'text', length: 40 })
    .$type<string | null>()
    .$onUpdate(() => null),
})

export const sqliteHierarciesTable = sqliteTable('hierarcies', {
  id: text('id', { mode: 'text', length: 36 }).primaryKey(),
  name: text('name', { mode: 'text', length: 100 }).notNull().unique(),
  description: text('description', { mode: 'text', length: 255 }).notNull(),
})

export const sqliteBusinessAreasTable = sqliteTable('business_areas', {
  id: text('id', { mode: 'text', length: 36 }).primaryKey(),
  name: text('name', { mode: 'text', length: 100 }).notNull().unique(),
  description: text('description', { mode: 'text', length: 255 }).notNull(),
})

export const sqliteEducationDegreesTable = sqliteTable('education_degrees', {
  id: text('id', { mode: 'text', length: 36 }).primaryKey(),
  name: text('name', { mode: 'text', length: 100 }).notNull().unique(),
  description: text('description', { mode: 'text', length: 255 }).notNull(),
})

export const sqliteContractTypesTable = sqliteTable('contract_types', {
  id: text('id', { mode: 'text', length: 36 }).primaryKey(),
  name: text('name', { mode: 'text', length: 100 }).notNull().unique(),
  description: text('description', { mode: 'text', length: 255 }).notNull(),
})

export const sqliteCollaboratorsTable = sqliteTable('collaborators', {
  userId: text('user_id', { mode: 'text', length: 36 })
    .primaryKey()
    .references(() => sqliteUsersTable.id),
  salary: real('salary').notNull().default(1750905),
  yearsExperience: real('years_experience').notNull().default(0.0),
  hierarcyId: text('hierarcy_id', { mode: 'text', length: 36 })
    .notNull()
    .references(() => sqliteHierarciesTable.id),
  businessAreaId: text('business_area_id', { mode: 'text', length: 36 })
    .notNull()
    .references(() => sqliteBusinessAreasTable.id),
  educationDegreeId: text('education_degree_id', { mode: 'text', length: 36 })
    .notNull()
    .references(() => sqliteEducationDegreesTable.id),
  contractTypeId: text('contract_type_id', { mode: 'text', length: 36 })
    .notNull()
    .references(() => sqliteContractTypesTable.id),
})

export const sqliteSaleTypesTable = sqliteTable('sale_types', {
  id: text('id', { mode: 'text', length: 36 }).primaryKey(),
  name: text('name', { mode: 'text', length: 100 }).notNull().unique(),
  description: text('description', { mode: 'text', length: 255 }).notNull(),
})

export const sqliteEngineerPositionsTable = sqliteTable('engineer_positions', {
  id: text('id', { mode: 'text', length: 36 }).primaryKey(),
  name: text('name', { mode: 'text', length: 100 }).notNull().unique(),
  description: text('description', { mode: 'text', length: 255 }).notNull(),
})

export const sqliteAccountantPositionsTable = sqliteTable(
  'accountant_positions',
  {
    id: text('id', { mode: 'text', length: 36 }).primaryKey(),
    name: text('name', { mode: 'text', length: 100 }).notNull().unique(),
    description: text('description', { mode: 'text', length: 255 }).notNull(),
  }
)

export const sqliteOperatorTypesTable = sqliteTable('operator_types', {
  id: text('id', { mode: 'text', length: 36 }).primaryKey(),
  name: text('name', { mode: 'text', length: 100 }).notNull().unique(),
  description: text('description', { mode: 'text', length: 255 }).notNull(),
})

export const sqliteSellersTable = sqliteTable('sellers', {
  userId: text('user_id', { mode: 'text', length: 36 })
    .primaryKey()
    .references(() => sqliteUsersTable.id),
  commissionRate: real('commission_rate').notNull().default(3.0),
  saleTypeId: text('sale_type_id')
    .notNull()
    .references(() => sqliteSaleTypesTable.id),
})

export const sqliteEngineersTable = sqliteTable('engineers', {
  userId: text('user_id', { mode: 'text', length: 36 })
    .primaryKey()
    .references(() => sqliteUsersTable.id),
  engineerPositionId: text('engineer_position_id', { mode: 'text', length: 36 })
    .notNull()
    .references(() => sqliteEngineerPositionsTable.id),
})

export const sqliteAccountantsTable = sqliteTable('accountants', {
  userId: text('user_id', { mode: 'text', length: 36 })
    .primaryKey()
    .references(() => sqliteUsersTable.id),
  accountantPositionId: text('accountant_position_id', {
    mode: 'text',
    length: 36,
  })
    .notNull()
    .references(() => sqliteAccountantPositionsTable.id),
})

export const sqliteOperatorsTable = sqliteTable('operators', {
  userId: text('user_id', { mode: 'text', length: 36 })
    .primaryKey()
    .references(() => sqliteUsersTable.id),
  operatorTypeId: text('operator_type_id', { mode: 'text', length: 36 })
    .notNull()
    .references(() => sqliteOperatorTypesTable.id),
})
