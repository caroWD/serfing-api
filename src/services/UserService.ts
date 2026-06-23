import { compare, genSalt, hash } from 'bcryptjs'
import { getTemporalNow } from '../helpers/index.js'
import {
  RoleNotFoundError,
  User,
  UserEmailAlreadyExistsError,
  UserHandleAlreadyExistsError,
  UserNotFoundError,
  UserUnauthorizedError,
} from '../models/index.js'
import {
  SqliteRoleRepository,
  SqliteUserRepository,
} from '../repositories/index.js'
import {
  addUserRequestSchema,
  authUserRequestSchema,
  changePasswordRequestSchema,
  editUserRequestSchema,
  idSchema,
  type AddUserRequest,
  type AuthUserRequest,
  type ChangePasswordRequest,
  type EditUserRequest,
  type IdRequest,
} from '../schemas/index.js'
import { SALT_ROUNDS } from '../config/index.js'
import type { sqliteUsersTable } from '../db/schemas/sqlite.js'

const userRepository = new SqliteUserRepository()
const roleRepository = new SqliteRoleRepository()

export class UserService {
  async add(req: AddUserRequest): Promise<void> {
    const { id, handle, firstName, lastName, email, password, state, roleId } =
      await addUserRequestSchema.parseAsync(req)

    const handleExists = await userRepository.ensureHandleAlreadyExists(handle)
    if (handleExists)
      throw new UserHandleAlreadyExistsError('El nombre de usuario ya existe')

    const emailExists = await userRepository.ensureEmailAlreadyExists(email)
    if (emailExists)
      throw new UserEmailAlreadyExistsError('El correo electrónico ya existe')

    const role = await roleRepository.findOne(roleId)
    if (!role) throw new RoleNotFoundError('El rol no existe')

    return await userRepository.add(
      new User(
        id,
        handle,
        firstName,
        lastName,
        email,
        password,
        !state ? 'pending' : state,
        role.id,
        getTemporalNow(),
        getTemporalNow(),
        null
      )
    )
  }

  async edit(req: EditUserRequest): Promise<void> {
    const { id, handle, firstName, lastName, email, state, roleId } =
      await editUserRequestSchema.parseAsync(req)

    const userToEdit = await userRepository.findOne(id)
    if (!userToEdit) throw new UserNotFoundError('El usuario no existe')

    if (handle !== userToEdit.handle) {
      const handleExists =
        await userRepository.ensureHandleAlreadyExists(handle)
      if (handleExists)
        throw new UserHandleAlreadyExistsError('El nombre de usuario ya existe')
    }

    if (email !== userToEdit.email) {
      const emailExists = await userRepository.ensureEmailAlreadyExists(email)
      if (emailExists)
        throw new UserEmailAlreadyExistsError('El correo electrónico ya existe')
    }

    const role = await roleRepository.findOne(roleId)
    if (!role) throw new RoleNotFoundError('El rol no existe')

    return await userRepository.edit(
      new User(
        userToEdit.id,
        handle,
        firstName,
        lastName,
        email,
        userToEdit.password,
        !state ? userToEdit.state : state,
        role.id,
        userToEdit.createdAt,
        getTemporalNow(),
        userToEdit.deletedAt
      )
    )
  }

  async changePassword(req: ChangePasswordRequest): Promise<void> {
    const { id, current, next } =
      await changePasswordRequestSchema.parseAsync(req)

    const user = await userRepository.findOne(id)
    if (!user) throw new UserNotFoundError('El usuario no existe')

    if (!(await compare(current, user.password)))
      throw new UserUnauthorizedError('Usuario no autorizado')

    return await userRepository.changePassword(
      id,
      await hash(next, await genSalt(Number(SALT_ROUNDS)))
    )
  }

  async softRemove(req: IdRequest): Promise<void> {
    const { id } = await idSchema.parseAsync(req)

    const userToSoftRemove = await userRepository.findOne(id)
    if (!userToSoftRemove) throw new UserNotFoundError('El usuario no existe')

    return await userRepository.softRemove(id)
  }

  async remove(req: Request): Promise<void> {
    const { id } = await idSchema.parseAsync(req)

    const userToRemove = await userRepository.findOne(id)
    if (!userToRemove) throw new UserNotFoundError('El usuario no existe')

    return await userRepository.remove(id)
  }

  async auth(
    req: AuthUserRequest
  ): Promise<typeof sqliteUsersTable.$inferSelect> {
    const { handle, password } = await authUserRequestSchema.parseAsync(req)

    const user = await userRepository.auth(handle)
    if (!user)
      throw new UserUnauthorizedError(
        'Nombre de usuario o contraseña incorrectas'
      )

    if (!(await compare(password, user.password)))
      throw new UserUnauthorizedError(
        'Nombre de usuario o contraseña incorrectas'
      )

    return await this.mapToUserSelect(user)
  }

  async findAll(): Promise<
    Omit<typeof sqliteUsersTable.$inferSelect, 'password'>[]
  > {
    const users = await userRepository.findAll()

    return !users.length
      ? []
      : await Promise.all(
          users.map(async (user) => await this.mapToUserDto(user))
        )
  }

  async findOne(
    req: IdRequest
  ): Promise<Omit<typeof sqliteUsersTable.$inferSelect, 'password'>> {
    const { id } = await idSchema.parseAsync(req)

    const user = await userRepository.findOne(id)
    if (!user) throw new UserNotFoundError('El usuario no existe')

    return await this.mapToUserDto(user)
  }

  private async mapToUserSelect(
    user: User
  ): Promise<typeof sqliteUsersTable.$inferSelect> {
    return {
      id: user.id,
      handle: user.handle,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: user.password,
      state: user.state,
      roleId: user.roleId,
      createdAt: user.createdAt.toJSON(),
      updatedAt: user.updatedAt.toJSON(),
      deletedAt: user.deletedAt?.toJSON() || null,
    }
  }

  private async mapToUserDto(
    user: User
  ): Promise<Omit<typeof sqliteUsersTable.$inferSelect, 'password'>> {
    return {
      id: user.id,
      handle: user.handle,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      state: user.state,
      roleId: user.roleId,
      createdAt: user.createdAt.toJSON(),
      updatedAt: user.updatedAt.toJSON(),
      deletedAt: user.deletedAt?.toJSON() || null,
    }
  }
}
