import { eq } from 'drizzle-orm'
import { sqlitePermissionsTable } from '../db/schemas/sqlite.js'
import type { IBaseRepository } from '../interfaces/index.js'
import { Permission } from '../models/index.js'
import { baseSchema } from '../schemas/base-schema.js'
import { sqlite } from './databases.js'

export class SqlitePermissionRepository implements IBaseRepository<Permission> {
  async add(entity: Permission): Promise<void> {
    const permissionMapped = await this.mapToPermissionInsert(entity)

    const { rowsAffected } = await sqlite
      .insert(sqlitePermissionsTable)
      .values(permissionMapped)

    if (!rowsAffected) throw new Error('Algo salio mal')
  }

  async edit(entity: Permission): Promise<void> {
    const permissionMapped = await this.mapToPermissionInsert(entity)

    const { rowsAffected } = await sqlite
      .update(sqlitePermissionsTable)
      .set({
        name: permissionMapped.name,
        description: permissionMapped.description,
      })
      .where(eq(sqlitePermissionsTable.id, permissionMapped.id))

    if (!rowsAffected) throw new Error('Algo salio mal')
  }

  async remove(id: string): Promise<void> {
    const { rowsAffected } = await sqlite
      .delete(sqlitePermissionsTable)
      .where(eq(sqlitePermissionsTable.id, id))

    if (!rowsAffected) throw new Error('Algo salio mal')
  }

  async findAll(): Promise<Permission[]> {
    const permissions = await sqlite.select().from(sqlitePermissionsTable)

    return !permissions.length
      ? []
      : await Promise.all(
          permissions.map(
            async (permission) => await this.mapToPermission(permission)
          )
        )
  }

  async findOne(id: string): Promise<Permission | null> {
    const [permission] = await sqlite
      .select()
      .from(sqlitePermissionsTable)
      .where(eq(sqlitePermissionsTable.id, id))

    return !permission ? null : await this.mapToPermission(permission)
  }

  async ensureAlreadyExists(name: string): Promise<boolean> {
    const [exists] = await sqlite
      .select({ name: sqlitePermissionsTable.name })
      .from(sqlitePermissionsTable)
      .where(eq(sqlitePermissionsTable.name, name))

    return !exists ? false : true
  }

  private async mapToPermissionInsert(
    permission: Permission
  ): Promise<typeof sqlitePermissionsTable.$inferInsert> {
    return {
      id: permission.id,
      name: permission.name,
      description: permission.description,
    }
  }

  private async mapToPermission(
    permission: typeof sqlitePermissionsTable.$inferInsert
  ): Promise<Permission> {
    const permissionParsed = await baseSchema.parseAsync(permission)

    return new Permission(
      permissionParsed.id,
      permissionParsed.name,
      permissionParsed.description
    )
  }
}
