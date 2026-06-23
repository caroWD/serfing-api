import { genSalt, hash } from 'bcryptjs'
import { sqliteUsersTable } from '../db/schemas/index.js'
import type { IUserRepository } from '../interfaces/index.js'
import { User } from '../models/index.js'
import { sqlite } from './databases.js'
import { eq } from 'drizzle-orm'
import { SALT_ROUNDS } from '../config/index.js'
import { getTemporalFrom, getTemporalNow } from '../helpers/index.js'
import { userSelectSchema } from '../schemas/user-schema.js'

export class SqliteUserRepository implements IUserRepository {
  async add(user: User): Promise<void> {
    const userMapped = await this.mapToUserInsert(user)

    const { rowsAffected } = await sqlite
      .insert(sqliteUsersTable)
      .values(userMapped)

    if (!rowsAffected) throw new Error('Algo salio mal')
  }

  async edit(user: User): Promise<void> {
    const userMapped = await this.mapToUserInsert(user)

    const { rowsAffected } = await sqlite
      .update(sqliteUsersTable)
      .set({
        handle: userMapped.handle,
        firstName: userMapped.firstName,
        lastName: userMapped.lastName,
        email: userMapped.email,
        state: userMapped.state,
        roleId: userMapped.roleId,
        updatedAt: userMapped.updatedAt,
      })
      .where(eq(sqliteUsersTable.id, userMapped.id))

    if (!rowsAffected) throw new Error('Algo salio mal')
  }

  async changePassword(id: string, next: string): Promise<void> {
    const { rowsAffected } = await sqlite
      .update(sqliteUsersTable)
      .set({
        password: next,
        updatedAt: getTemporalNow().toJSON(),
      })
      .where(eq(sqliteUsersTable.id, id))

    if (!rowsAffected) throw new Error('Algo salio mal')
  }

  async softRemove(id: string): Promise<void> {
    const { rowsAffected } = await sqlite
      .update(sqliteUsersTable)
      .set({
        updatedAt: getTemporalNow().toJSON(),
        deletedAt: getTemporalNow().toJSON(),
      })
      .where(eq(sqliteUsersTable.id, id))

    if (!rowsAffected) throw new Error('Algo salio mal')
  }

  async remove(id: string): Promise<void> {
    const { rowsAffected } = await sqlite
      .delete(sqliteUsersTable)
      .where(eq(sqliteUsersTable.id, id))

    if (!rowsAffected) throw new Error('Algo salio mal')
  }

  async auth(handle: string): Promise<User | null> {
    const [user] = await sqlite
      .select()
      .from(sqliteUsersTable)
      .where(eq(sqliteUsersTable.handle, handle))

    return !user ? null : await this.mapToUser(user)
  }

  async findAll(): Promise<User[]> {
    const users = await sqlite.select().from(sqliteUsersTable)

    return !users.length
      ? []
      : await Promise.all(users.map(async (user) => await this.mapToUser(user)))
  }

  async findOne(id: string): Promise<User | null> {
    const [user] = await sqlite
      .select()
      .from(sqliteUsersTable)
      .where(eq(sqliteUsersTable.id, id))

    return !user ? null : await this.mapToUser(user)
  }

  async ensureHandleAlreadyExists(handle: string): Promise<boolean> {
    const [exists] = await sqlite
      .select({ handle: sqliteUsersTable.handle })
      .from(sqliteUsersTable)
      .where(eq(sqliteUsersTable.handle, handle))

    return !exists ? false : true
  }

  async ensureEmailAlreadyExists(email: string): Promise<boolean> {
    const [exists] = await sqlite
      .select()
      .from(sqliteUsersTable)
      .where(eq(sqliteUsersTable.email, email))

    return !exists ? false : true
  }

  private async mapToUserInsert(
    user: User
  ): Promise<typeof sqliteUsersTable.$inferInsert> {
    return {
      id: user.id,
      handle: user.handle,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: await hash(user.password, await genSalt(Number(SALT_ROUNDS))),
      state: user.state,
      roleId: user.roleId,
      createdAt: user.createdAt.toJSON(),
      updatedAt: user.updatedAt.toJSON(),
      deletedAt: user.deletedAt?.toJSON() || null,
    }
  }

  private async mapToUser(
    user: typeof sqliteUsersTable.$inferSelect
  ): Promise<User> {
    const userParsed = await userSelectSchema.parseAsync(user)

    return new User(
      userParsed.id,
      userParsed.handle,
      userParsed.firstName,
      userParsed.lastName,
      userParsed.email,
      userParsed.password,
      userParsed.state,
      userParsed.roleId,
      getTemporalFrom(userParsed.createdAt),
      getTemporalFrom(userParsed.updatedAt),
      !userParsed.deletedAt ? null : getTemporalFrom(userParsed.deletedAt)
    )
  }
}
