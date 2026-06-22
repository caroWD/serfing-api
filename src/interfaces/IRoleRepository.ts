import type { Permission, Role } from '../models/index.js'
import type { IBaseRepository } from './IBaseRepository.js'

export interface IRoleRepository extends IBaseRepository<Role> {
  addPermissionToRole(roleId: string, permissionId: string): Promise<void>

  removePermissionToRole(roleId: string, permissionId: string): Promise<void>

  findPermissionsForRole(roleId: string): Promise<Permission[]>

  ensureRoleHasThisPermission(
    roleId: string,
    permissionId: string
  ): Promise<boolean>
}
