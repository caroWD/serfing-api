import type { sqliteHierarciesTable } from '../db/schemas/sqlite.js'
import {
  Hierarchy,
  HierarchyAlreadyExistsError,
  HierarchyNotFoundError,
} from '../models/index.js'
import { SqliteHierarchyRepository } from '../repositories/index.js'
import {
  baseSchema,
  idSchema,
  type BaseRequest,
  type IdRequest,
} from '../schemas/index.js'

const hierarchyRepository = new SqliteHierarchyRepository()

export class HierarchyService {
  async add(req: BaseRequest): Promise<void> {
    const { id, name, description } = await baseSchema.parseAsync(req)

    const hierarchyExists = await hierarchyRepository.ensureAlreadyExists(name)
    if (hierarchyExists)
      throw new HierarchyAlreadyExistsError('La jerarquía ya existe')

    return await hierarchyRepository.add(new Hierarchy(id, name, description))
  }

  async edit(req: BaseRequest): Promise<void> {
    const { id, name, description } = await baseSchema.parseAsync(req)

    const hierarchyToEdit = await hierarchyRepository.findOne(id)
    if (!hierarchyToEdit)
      throw new HierarchyNotFoundError('La jerarquía no existe')

    if (name !== hierarchyToEdit.name) {
      const hierarchyExists =
        await hierarchyRepository.ensureAlreadyExists(name)
      if (hierarchyExists)
        throw new HierarchyAlreadyExistsError('La jerarquía ya existe')
    }

    return await hierarchyRepository.edit(
      new Hierarchy(hierarchyToEdit.id, name, description)
    )
  }

  async remove(req: IdRequest): Promise<void> {
    const { id } = await idSchema.parseAsync(req)

    const hierarchyToRemove = await hierarchyRepository.findOne(id)
    if (!hierarchyToRemove)
      throw new HierarchyNotFoundError('La jerarquía no existe')

    return await hierarchyRepository.remove(hierarchyToRemove.id)
  }

  async findAll(): Promise<(typeof sqliteHierarciesTable.$inferSelect)[]> {
    const hierarcies = await hierarchyRepository.findAll()

    return !hierarcies.length
      ? []
      : hierarcies.map<typeof sqliteHierarciesTable.$inferSelect>(
          (hierarchy) => ({
            id: hierarchy.id,
            name: hierarchy.name,
            description: hierarchy.description,
          })
        )
  }

  async findOne(
    req: IdRequest
  ): Promise<typeof sqliteHierarciesTable.$inferSelect> {
    const { id } = await idSchema.parseAsync(req)

    const hierarchy = await hierarchyRepository.findOne(id)
    if (!hierarchy) throw new HierarchyNotFoundError('La jerarquía no existe')

    return {
      id: hierarchy.id,
      name: hierarchy.name,
      description: hierarchy.description,
    }
  }
}
