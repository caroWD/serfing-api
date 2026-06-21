import type { sqliteSaleTypesTable } from '../db/schemas/sqlite.js'
import {
  SaleType,
  SaleTypeAlreadyExistsError,
  SaleTypeNotFoundError,
} from '../models/index.js'
import { SqliteSaleTypeRepository } from '../repositories/index.js'
import {
  baseSchema,
  idSchema,
  type BaseRequest,
  type IdRequest,
} from '../schemas/index.js'

const saleTypeRepository = new SqliteSaleTypeRepository()

export class SaleTypeService {
  async add(req: BaseRequest): Promise<void> {
    const { id, name, description } = await baseSchema.parseAsync(req)

    const saleTypeExists = await saleTypeRepository.ensureAlreadyExists(name)
    if (saleTypeExists)
      throw new SaleTypeAlreadyExistsError('El tipo de venta ya existe')

    return await saleTypeRepository.add(new SaleType(id, name, description))
  }

  async edit(req: BaseRequest): Promise<void> {
    const { id, name, description } = await baseSchema.parseAsync(req)

    const saleTypeToEdit = await saleTypeRepository.findOne(id)
    if (!saleTypeToEdit)
      throw new SaleTypeNotFoundError('El tipo de venta no existe')

    if (name !== saleTypeToEdit.name) {
      const saleTypeExists = await saleTypeRepository.ensureAlreadyExists(name)
      if (saleTypeExists)
        throw new SaleTypeAlreadyExistsError('El tipo de venta ya existe')
    }

    return await saleTypeRepository.edit(new SaleType(id, name, description))
  }

  async remove(req: IdRequest): Promise<void> {
    const { id } = await idSchema.parseAsync(req)

    const saleTypeToRemove = await saleTypeRepository.findOne(id)
    if (!saleTypeToRemove)
      throw new SaleTypeNotFoundError('El tipo de venta no existe')

    return await saleTypeRepository.remove(saleTypeToRemove.id)
  }

  async findAll(): Promise<(typeof sqliteSaleTypesTable.$inferSelect)[]> {
    const saleTypes = await saleTypeRepository.findAll()

    return !saleTypes.length
      ? []
      : saleTypes.map<typeof sqliteSaleTypesTable.$inferSelect>((saleType) => ({
          id: saleType.id,
          name: saleType.name,
          description: saleType.description,
        }))
  }

  async findOne(
    req: IdRequest
  ): Promise<typeof sqliteSaleTypesTable.$inferSelect> {
    const { id } = await idSchema.parseAsync(req)

    const saleType = await saleTypeRepository.findOne(id)
    if (!saleType) throw new SaleTypeNotFoundError('El tipo de venta no existe')

    return {
      id: saleType.id,
      name: saleType.name,
      description: saleType.description,
    }
  }
}
