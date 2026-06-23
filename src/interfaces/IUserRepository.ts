import type { User } from '../models/User.js'

export interface IUserRepository {
  add(user: User): Promise<void>

  edit(user: User): Promise<void>

  changePassword(id: string, next: string): Promise<void>

  softRemove(id: string): Promise<void>

  remove(id: string): Promise<void>

  auth(handle: string): Promise<User | null>

  findAll(): Promise<User[]>

  findOne(id: string): Promise<User | null>

  ensureHandleAlreadyExists(handle: string): Promise<boolean>

  ensureEmailAlreadyExists(email: string): Promise<boolean>
}
