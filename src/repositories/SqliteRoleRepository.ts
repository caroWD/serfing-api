import { and, eq } from 'drizzle-orm'
import {
  sqlitePermissionsTable,
  sqliteRolePermissionsTable,
  sqliteRolesTable,
} from '../db/schemas/index.js'
import type { IRoleRepository } from '../interfaces/index.js'
import { Permission, Role } from '../models/index.js'
import { sqlite } from './databases.js'
import { baseSchema } from '../schemas/index.js'

export class SqliteRoleRepository implements IRoleRepository {
  async addPermissionToRole(
    roleId: string,
    permissionId: string
  ): Promise<void> {
    const { rowsAffected } = await sqlite
      .insert(sqliteRolePermissionsTable)
      .values({ roleId, permissionId })

    if (!rowsAffected) throw new Error('Algo salio mal')
  }

  async removePermissionToRole(
    roleId: string,
    permissionId: string
  ): Promise<void> {
    const { rowsAffected } = await sqlite
      .delete(sqliteRolePermissionsTable)
      .where(
        and(
          eq(sqliteRolePermissionsTable.roleId, roleId),
          eq(sqliteRolePermissionsTable.permissionId, permissionId)
        )
      )

    if (!rowsAffected) throw new Error('Algo salio mal')
  }

  async findPermissionsForRole(roleId: string): Promise<Permission[]> {
    const permissions = (
      await sqlite
        .select()
        .from(sqliteRolePermissionsTable)
        .where(eq(sqliteRolePermissionsTable.roleId, roleId))
        .leftJoin(
          sqlitePermissionsTable,
          eq(sqliteRolePermissionsTable.permissionId, sqlitePermissionsTable.id)
        )
    )
      .map((result) => result.permissions)
      .filter((result) => result !== null)

    return !permissions.length
      ? []
      : await Promise.all(
          permissions.map(
            async (permission) => await this.mapToPermission(permission)
          )
        )
  }

  async ensureRoleHasThisPermission(
    roleId: string,
    permissionId: string
  ): Promise<boolean> {
    const [exists] = await sqlite
      .select()
      .from(sqliteRolePermissionsTable)
      .where(
        and(
          eq(sqliteRolePermissionsTable.roleId, roleId),
          eq(sqliteRolePermissionsTable.permissionId, permissionId)
        )
      )

    return !exists ? false : true
  }

  async add(entity: Role): Promise<void> {
    const role = await this.mapToRoleInsert(entity)

    const { rowsAffected } = await sqlite.insert(sqliteRolesTable).values(role)

    if (!rowsAffected) throw new Error('Algo salio mal')
  }

  async edit(entity: Role): Promise<void> {
    const role = await this.mapToRoleInsert(entity)

    const { rowsAffected } = await sqlite
      .update(sqliteRolesTable)
      .set({
        name: role.name,
        description: role.description,
      })
      .where(eq(sqliteRolesTable.id, role.id))

    if (!rowsAffected) throw new Error('Algo salio mal')
  }

  async remove(id: string): Promise<void> {
    const { rowsAffected } = await sqlite
      .delete(sqliteRolesTable)
      .where(eq(sqliteRolesTable.id, id))

    if (!rowsAffected) throw new Error('Algo salio mal')
  }

  async findAll(): Promise<Role[]> {
    const roles = await sqlite.select().from(sqliteRolesTable)

    return !roles.length
      ? []
      : await Promise.all(roles.map(async (role) => await this.mapToRole(role)))
  }

  async findOne(id: string): Promise<Role | null> {
    const [role] = await sqlite
      .select()
      .from(sqliteRolesTable)
      .where(eq(sqliteRolesTable.id, id))

    return !role ? null : await this.mapToRole(role)
  }

  async ensureAlreadyExists(name: string): Promise<boolean> {
    const [exists] = await sqlite
      .select({ name: sqliteRolesTable.name })
      .from(sqliteRolesTable)
      .where(eq(sqliteRolesTable.name, name))

    return !exists ? false : true
  }

  private async mapToRoleInsert(
    role: Role
  ): Promise<typeof sqliteRolesTable.$inferInsert> {
    return {
      id: role.id,
      name: role.name,
      description: role.description,
    }
  }

  private async mapToRole(
    role: typeof sqliteRolesTable.$inferSelect
  ): Promise<Role> {
    const roleParsed = await baseSchema.parseAsync(role)

    return new Role(roleParsed.id, roleParsed.name, roleParsed.description)
  }

  private async mapToPermission(
    permission: typeof sqlitePermissionsTable.$inferSelect
  ): Promise<Permission> {
    const permissionParsed = await baseSchema.parseAsync(permission)

    return new Permission(
      permissionParsed.id,
      permissionParsed.name,
      permissionParsed.description
    )
  }
}
