import { sqlitePermissionsTable } from '../db/schemas/sqlite.js'
import {
  Permission,
  PermissionAlreadyExistsError,
  PermissionNotFoundError,
} from '../models/index.js'
import { SqlitePermissionRepository } from '../repositories/index.js'
import {
  baseSchema,
  idSchema,
  type BaseRequest,
  type IdRequest,
} from '../schemas/index.js'

const permissionRepository = new SqlitePermissionRepository()

export class PermissionService {
  async add(req: BaseRequest): Promise<void> {
    const permission = await baseSchema.parseAsync(req)

    const permissionExists = await permissionRepository.ensureAlreadyExists(
      permission.name
    )
    if (permissionExists)
      throw new PermissionAlreadyExistsError('El permiso ya existe')

    return await permissionRepository.add(
      new Permission(permission.id, permission.name, permission.description)
    )
  }

  async edit(req: BaseRequest): Promise<void> {
    const permission = await baseSchema.parseAsync(req)

    const permissionToEdit = await permissionRepository.findOne(permission.id)
    if (!permissionToEdit)
      throw new PermissionNotFoundError('El permiso no existe')

    if (permission.name !== permissionToEdit.name) {
      const permissionExists = await permissionRepository.ensureAlreadyExists(
        permission.name
      )
      if (permissionExists)
        throw new PermissionAlreadyExistsError('El permiso ya existe')
    }

    return await permissionRepository.edit(
      new Permission(permission.id, permission.name, permission.description)
    )
  }

  async remove(req: IdRequest): Promise<void> {
    const { id } = await idSchema.parseAsync(req)

    const permissionToRemove = await permissionRepository.findOne(id)
    if (!permissionToRemove)
      throw new PermissionNotFoundError('El permiso no existe')

    return await permissionRepository.remove(permissionToRemove.id)
  }

  async findAll(): Promise<(typeof sqlitePermissionsTable.$inferSelect)[]> {
    const permissions = await permissionRepository.findAll()

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

  async findOne(
    req: IdRequest
  ): Promise<typeof sqlitePermissionsTable.$inferSelect> {
    const { id } = await idSchema.parseAsync(req)

    const permissionFinded = await permissionRepository.findOne(id)
    if (!permissionFinded)
      throw new PermissionNotFoundError('El permiso no existe')

    return {
      id: permissionFinded.id,
      name: permissionFinded.name,
      description: permissionFinded.description,
    }
  }
}
