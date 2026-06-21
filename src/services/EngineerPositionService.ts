import type { sqliteEngineerPositionsTable } from '../db/schemas/sqlite.js'
import {
  EngineerPosition,
  EngineerPositionAlreadyExistsError,
  EngineerPositionNotFoundError,
} from '../models/index.js'
import { SqliteEngineerPositionRepository } from '../repositories/index.js'
import {
  baseSchema,
  idSchema,
  type BaseRequest,
  type IdRequest,
} from '../schemas/index.js'

const engineerPositionRepository = new SqliteEngineerPositionRepository()

export class EngineerPositionService {
  async add(req: BaseRequest): Promise<void> {
    const { id, name, description } = await baseSchema.parseAsync(req)

    const engineerPositionExists =
      await engineerPositionRepository.ensureAlreadyExists(name)
    if (engineerPositionExists)
      throw new EngineerPositionAlreadyExistsError(
        'El cargo de ingeniero ya existe'
      )

    return await engineerPositionRepository.add(
      new EngineerPosition(id, name, description)
    )
  }

  async edit(req: BaseRequest): Promise<void> {
    const { id, name, description } = await baseSchema.parseAsync(req)

    const engineerPositionToEdit = await engineerPositionRepository.findOne(id)
    if (!engineerPositionToEdit)
      throw new EngineerPositionNotFoundError('El cargo de ingeniero no existe')

    if (name !== engineerPositionToEdit.name) {
      const engineerPositionExists =
        await engineerPositionRepository.ensureAlreadyExists(name)
      if (engineerPositionExists)
        throw new EngineerPositionAlreadyExistsError(
          'El cargo de ingeniero ya existe'
        )
    }

    return await engineerPositionRepository.edit(
      new EngineerPosition(engineerPositionToEdit.id, name, description)
    )
  }

  async remove(req: IdRequest): Promise<void> {
    const { id } = await idSchema.parseAsync(req)

    const engineerPositionToRemove =
      await engineerPositionRepository.findOne(id)
    if (!engineerPositionToRemove)
      throw new EngineerPositionNotFoundError('El cargo de ingeniero no existe')

    return await engineerPositionRepository.remove(engineerPositionToRemove.id)
  }

  async findAll(): Promise<
    (typeof sqliteEngineerPositionsTable.$inferSelect)[]
  > {
    const engineerPositions = await engineerPositionRepository.findAll()

    return !engineerPositions.length
      ? []
      : engineerPositions.map<typeof sqliteEngineerPositionsTable.$inferSelect>(
          (engineerPosition) => ({
            id: engineerPosition.id,
            name: engineerPosition.name,
            description: engineerPosition.description,
          })
        )
  }

  async findOne(
    req: IdRequest
  ): Promise<typeof sqliteEngineerPositionsTable.$inferSelect> {
    const { id } = await idSchema.parseAsync(req)

    const engineerPositionFinded = await engineerPositionRepository.findOne(id)
    if (!engineerPositionFinded)
      throw new EngineerPositionNotFoundError('El cargo de ingeniero no existe')

    return {
      id: engineerPositionFinded.id,
      name: engineerPositionFinded.name,
      description: engineerPositionFinded.description,
    }
  }
}
