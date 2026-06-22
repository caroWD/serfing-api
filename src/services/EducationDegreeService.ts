import type { sqliteEducationDegreesTable } from '../db/schemas/index.js'
import {
  EducationDegree,
  EducationDegreeAlreadyExistsError,
  EducationDegreeNotFoundError,
} from '../models/index.js'
import { SqliteEducationDegreeRepository } from '../repositories/index.js'
import {
  baseSchema,
  idSchema,
  type BaseRequest,
  type IdRequest,
} from '../schemas/index.js'

const educationDegreeRepository = new SqliteEducationDegreeRepository()

export class EducationDegreeService {
  async add(req: BaseRequest): Promise<void> {
    const { id, name, description } = await baseSchema.parseAsync(req)

    const educationDegreeExists =
      await educationDegreeRepository.ensureAlreadyExists(name)
    if (educationDegreeExists)
      throw new EducationDegreeAlreadyExistsError(
        'El grado de educación ya existe'
      )

    return await educationDegreeRepository.add(
      new EducationDegree(id, name, description)
    )
  }

  async edit(req: BaseRequest): Promise<void> {
    const { id, name, description } = await baseSchema.parseAsync(req)

    const educationDegreeToEdit = await educationDegreeRepository.findOne(id)
    if (!educationDegreeToEdit)
      throw new EducationDegreeNotFoundError('El grado de educación no existe')

    if (name !== educationDegreeToEdit.name) {
      const educationDegreeExists =
        await educationDegreeRepository.ensureAlreadyExists(name)
      if (educationDegreeExists)
        throw new EducationDegreeAlreadyExistsError(
          'El grado de educación ya existe'
        )
    }

    return await educationDegreeRepository.edit(
      new EducationDegree(educationDegreeToEdit.id, name, description)
    )
  }

  async remove(req: IdRequest): Promise<void> {
    const { id } = await idSchema.parseAsync(req)

    const educationDegreeToRemove = await educationDegreeRepository.findOne(id)
    if (!educationDegreeToRemove)
      throw new EducationDegreeNotFoundError('El grado de educación no existe')

    return await educationDegreeRepository.remove(educationDegreeToRemove.id)
  }

  async findAll(): Promise<
    (typeof sqliteEducationDegreesTable.$inferSelect)[]
  > {
    const educationDegrees = await educationDegreeRepository.findAll()

    return !educationDegrees.length
      ? []
      : educationDegrees.map<typeof sqliteEducationDegreesTable.$inferSelect>(
          (educationDegree) => ({
            id: educationDegree.id,
            name: educationDegree.name,
            description: educationDegree.description,
          })
        )
  }

  async findOne(
    req: IdRequest
  ): Promise<typeof sqliteEducationDegreesTable.$inferSelect> {
    const { id } = await idSchema.parseAsync(req)

    const educationDegree = await educationDegreeRepository.findOne(id)
    if (!educationDegree)
      throw new EducationDegreeNotFoundError('El grado de educación no existe')

    return {
      id: educationDegree.id,
      name: educationDegree.name,
      description: educationDegree.description,
    }
  }
}
