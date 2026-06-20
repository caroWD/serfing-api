import type {
  sqlitePermissionsTable,
  sqliteRolesTable,
} from '../db/schemas/sqlite.js'
import {
  RoleAlreadyExistsError,
  RoleAlreadyHasThatPermissionError,
  Role,
  RoleNotFoundError,
  RoleDoesNotHaveThatPermissionError,
  PermissionNotFoundError,
} from '../models/index.js'
import {
  SqlitePermissionRepository,
  SqliteRoleRepository,
} from '../repositories/index.js'
import {
  baseSchema,
  idSchema,
  rolePermissionSchema,
  type BaseRequest,
  type IdRequest,
  type RolePermissionRequest,
} from '../schemas/index.js'

const roleRepository = new SqliteRoleRepository()
const permissionRepository = new SqlitePermissionRepository()

export class RoleService {
  async add(req: BaseRequest): Promise<void> {
    const { id, name, description } = await baseSchema.parseAsync(req)

    const roleExists = await roleRepository.ensureAlreadyExists(name)
    if (roleExists) throw new RoleAlreadyExistsError('El rol ya existe')

    return await roleRepository.add(new Role(id, name, description))
  }

  async addPermissionToRole(req: RolePermissionRequest): Promise<void> {
    const { roleId, permissionId } = await rolePermissionSchema.parseAsync(req)

    const role = await roleRepository.findOne(roleId)
    if (!role) throw new RoleNotFoundError('El rol no existe')

    const permission = await permissionRepository.findOne(permissionId)
    if (!permission) throw new PermissionNotFoundError('El permiso no existe')

    const rolePermissionExists =
      await roleRepository.ensureRoleHasThisPermission(role.id, permission.id)
    if (rolePermissionExists)
      throw new RoleAlreadyHasThatPermissionError('El rol ya tiene ese permiso')

    return await roleRepository.addPermissionToRole(role.id, permission.id)
  }

  async edit(req: BaseRequest): Promise<void> {
    const { id, name, description } = await baseSchema.parseAsync(req)

    const roleToEdit = await roleRepository.findOne(id)
    if (!roleToEdit) throw new RoleNotFoundError('El rol no existe')

    if (name !== roleToEdit.name) {
      const roleExists = await roleRepository.ensureAlreadyExists(name)
      if (roleExists) throw new RoleAlreadyExistsError('El rol ya existe')
    }

    return await roleRepository.edit(new Role(id, name, description))
  }

  async remove(req: IdRequest): Promise<void> {
    const { id } = await idSchema.parseAsync(req)

    const roleToRemove = await roleRepository.findOne(id)
    if (!roleToRemove) throw new RoleNotFoundError('El rol no existe')

    return await roleRepository.remove(id)
  }

  async removePermissionToRole(req: RolePermissionRequest): Promise<void> {
    const { roleId, permissionId } = await rolePermissionSchema.parseAsync(req)

    const role = await roleRepository.findOne(roleId)
    if (!role) throw new RoleNotFoundError('El rol no existe')

    const permission = await permissionRepository.findOne(permissionId)
    if (!permission) throw new PermissionNotFoundError('El permiso no existe')

    const rolePermissionExists =
      await roleRepository.ensureRoleHasThisPermission(role.id, permission.id)
    if (!rolePermissionExists)
      throw new RoleDoesNotHaveThatPermissionError(
        'El rol no tiene ese permiso'
      )

    return await roleRepository.removePermissionToRole(role.id, permission.id)
  }

  async findAll(): Promise<(typeof sqliteRolesTable.$inferSelect)[]> {
    const roles = await roleRepository.findAll()

    return !roles.length
      ? []
      : roles.map<typeof sqliteRolesTable.$inferSelect>((role) => ({
          id: role.id,
          name: role.name,
          description: role.description,
        }))
  }

  async findOne(req: IdRequest): Promise<typeof sqliteRolesTable.$inferSelect> {
    const { id } = await idSchema.parseAsync(req)

    const roleFinded = await roleRepository.findOne(id)
    if (!roleFinded) throw new RoleNotFoundError('El rol no existe')

    return {
      id: roleFinded.id,
      name: roleFinded.name,
      description: roleFinded.description,
    }
  }

  async findPermissionsForRole(
    req: IdRequest
  ): Promise<(typeof sqlitePermissionsTable.$inferSelect)[]> {
    const { id } = await idSchema.parseAsync(req)

    const role = await roleRepository.findOne(id)
    if (!role) throw new RoleNotFoundError('El rol no existe')

    const permissions = await roleRepository.findPermissionsForRole(role.id)

    return !permissions.length
      ? []
      : permissions.map<typeof sqlitePermissionsTable.$inferSelect>(
          (permission) => ({
            id: permission.id,
            name: permission.name,
            description: permission.description,
          })
        )
  }
}
