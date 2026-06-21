import type { sqliteOperatorTypesTable } from '../db/schemas/index.js'
import {
  OperatorTypeAlreadyExistsError,
  OperatorType,
  OperatorTypeNotFoundError,
} from '../models/index.js'
import { SqliteOperatorTypeRepository } from '../repositories/index.js'
import {
  baseSchema,
  idSchema,
  type BaseRequest,
  type IdRequest,
} from '../schemas/index.js'

const operatorTypeRepository = new SqliteOperatorTypeRepository()

export class OperatorTypeService {
  async add(req: BaseRequest): Promise<void> {
    const { id, name, description } = await baseSchema.parseAsync(req)

    const operatorTypeExists =
      await operatorTypeRepository.ensureAlreadyExists(name)
    if (operatorTypeExists)
      throw new OperatorTypeAlreadyExistsError('El tipo de operario ya existe')

    return await operatorTypeRepository.add(
      new OperatorType(id, name, description)
    )
  }

  async edit(req: BaseRequest): Promise<void> {
    const { id, name, description } = await baseSchema.parseAsync(req)

    const operatorTypeToEdit = await operatorTypeRepository.findOne(id)
    if (!operatorTypeToEdit)
      throw new OperatorTypeNotFoundError('El tipo de operador no existe')

    if (name !== operatorTypeToEdit.name) {
      const operatorTypeExists =
        await operatorTypeRepository.ensureAlreadyExists(name)
      if (operatorTypeExists)
        throw new OperatorTypeAlreadyExistsError(
          'El tipo de operario ya existe'
        )
    }

    return await operatorTypeRepository.edit(
      new OperatorType(operatorTypeToEdit.id, name, description)
    )
  }

  async remove(req: IdRequest): Promise<void> {
    const { id } = await idSchema.parseAsync(req)

    const operatorTypeToRemove = await operatorTypeRepository.findOne(id)
    if (!operatorTypeToRemove)
      throw new OperatorTypeNotFoundError('El tipo de operador no existe')

    return await operatorTypeRepository.remove(operatorTypeToRemove.id)
  }

  async findAll(): Promise<(typeof sqliteOperatorTypesTable.$inferSelect)[]> {
    const operatorTypes = await operatorTypeRepository.findAll()

    return !operatorTypes.length
      ? []
      : operatorTypes.map<typeof sqliteOperatorTypesTable.$inferSelect>(
          (operatorType) => ({
            id: operatorType.id,
            name: operatorType.name,
            description: operatorType.description,
          })
        )
  }

  async findOne(
    req: IdRequest
  ): Promise<typeof sqliteOperatorTypesTable.$inferSelect> {
    const { id } = await idSchema.parseAsync(req)

    const operatorTypeFinded = await operatorTypeRepository.findOne(id)
    if (!operatorTypeFinded)
      throw new OperatorTypeNotFoundError('El tipo de operador no existe')

    return {
      id: operatorTypeFinded.id,
      name: operatorTypeFinded.name,
      description: operatorTypeFinded.description,
    }
  }
}
