export interface IBaseRepository<T> {
  add(entity: T): Promise<void>

  edit(entity: T): Promise<void>

  remove(id: string): Promise<void>

  findAll(): Promise<T[]>

  findOne(id: string): Promise<T | null>

  ensureAlreadyExists(name: string): Promise<boolean>
}
