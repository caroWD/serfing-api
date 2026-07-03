export interface IUsersRepository<T> {
  add(user: T): Promise<void>

  edit(user: T): Promise<void>

  remove(id: string): Promise<void>

  findAll(): Promise<T[]>

  findOne(id: string): Promise<T | null>
}
