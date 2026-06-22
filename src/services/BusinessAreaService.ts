import type { sqliteBusinessAreasTable } from '../db/schemas/index.js'
import {
  BusinessArea,
  BusinessAreaAlreadyExistsError,
  BusinessAreaNotFoundError,
} from '../models/index.js'
import { SqliteBusinessAreaRepository } from '../repositories/index.js'
import {
  baseSchema,
  idSchema,
  type BaseRequest,
  type IdRequest,
} from '../schemas/index.js'

const businessAreaRepository = new SqliteBusinessAreaRepository()

export class BusinessAreaService {
  async add(req: BaseRequest): Promise<void> {
    const { id, name, description } = await baseSchema.parseAsync(req)

    const businessAreaExists =
      await businessAreaRepository.ensureAlreadyExists(name)
    if (businessAreaExists)
      throw new BusinessAreaAlreadyExistsError('El área de trabajo ya existe')

    return await businessAreaRepository.add(
      new BusinessArea(id, name, description)
    )
  }

  async edit(req: BaseRequest): Promise<void> {
    const { id, name, description } = await baseSchema.parseAsync(req)

    const businessAreaToEdit = await businessAreaRepository.findOne(id)
    if (!businessAreaToEdit)
      throw new BusinessAreaNotFoundError('El área de trabajo no existe')

    if (name !== businessAreaToEdit.name) {
      const businessAreaExists =
        await businessAreaRepository.ensureAlreadyExists(name)
      if (businessAreaExists)
        throw new BusinessAreaAlreadyExistsError('El área de trabajo ya existe')
    }

    return await businessAreaRepository.edit(
      new BusinessArea(businessAreaToEdit.id, name, description)
    )
  }

  async remove(req: IdRequest): Promise<void> {
    const { id } = await idSchema.parseAsync(req)

    const businessAreaToRemove = await businessAreaRepository.findOne(id)
    if (!businessAreaToRemove)
      throw new BusinessAreaNotFoundError('El área de trabajo no existe')

    return await businessAreaRepository.remove(businessAreaToRemove.id)
  }

  async findAll(): Promise<(typeof sqliteBusinessAreasTable.$inferSelect)[]> {
    const businessAreas = await businessAreaRepository.findAll()

    return !businessAreas.length
      ? []
      : businessAreas.map<typeof sqliteBusinessAreasTable.$inferSelect>(
          (businessArea) => ({
            id: businessArea.id,
            name: businessArea.name,
            description: businessArea.description,
          })
        )
  }

  async findOne(
    req: IdRequest
  ): Promise<typeof sqliteBusinessAreasTable.$inferSelect> {
    const { id } = await idSchema.parseAsync(req)

    const businessArea = await businessAreaRepository.findOne(id)
    if (!businessArea)
      throw new BusinessAreaNotFoundError('El área de trabajo no existe')

    return {
      id: businessArea.id,
      name: businessArea.name,
      description: businessArea.description,
    }
  }
}
