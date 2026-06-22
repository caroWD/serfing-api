import type { sqliteContractTypesTable } from '../db/schemas/index.js'
import {
  ContractType,
  ContractTypeAlreadyExistsError,
  ContractTypeNotFoundError,
} from '../models/index.js'
import { SqliteContractTypeRepository } from '../repositories/index.js'
import {
  baseSchema,
  idSchema,
  type BaseRequest,
  type IdRequest,
} from '../schemas/index.js'

const contractTypeRepository = new SqliteContractTypeRepository()

export class ContractTypeService {
  async add(req: BaseRequest): Promise<void> {
    const { id, name, description } = await baseSchema.parseAsync(req)

    const contractTypeExists =
      await contractTypeRepository.ensureAlreadyExists(name)
    if (contractTypeExists)
      throw new ContractTypeAlreadyExistsError('El tipo de contrato ya existe')

    return await contractTypeRepository.add(
      new ContractType(id, name, description)
    )
  }

  async edit(req: BaseRequest): Promise<void> {
    const { id, name, description } = await baseSchema.parseAsync(req)

    const contractTypeToEdit = await contractTypeRepository.findOne(id)
    if (!contractTypeToEdit)
      throw new ContractTypeNotFoundError('El tipo de contrato no existe')

    if (name !== contractTypeToEdit.name) {
      const contractTypeExists =
        await contractTypeRepository.ensureAlreadyExists(name)
      if (contractTypeExists)
        throw new ContractTypeAlreadyExistsError(
          'El tipo de contrato ya existe'
        )
    }

    return await contractTypeRepository.edit(
      new ContractType(contractTypeToEdit.id, name, description)
    )
  }

  async remove(req: IdRequest): Promise<void> {
    const { id } = await idSchema.parseAsync(req)

    const contractTypeToRemove = await contractTypeRepository.findOne(id)
    if (!contractTypeToRemove)
      throw new ContractTypeNotFoundError('El tipo de contrato no existe')

    return await contractTypeRepository.remove(contractTypeToRemove.id)
  }

  async findAll(): Promise<(typeof sqliteContractTypesTable.$inferSelect)[]> {
    const contractTypes = await contractTypeRepository.findAll()

    return !contractTypes.length
      ? []
      : contractTypes.map<typeof sqliteContractTypesTable.$inferSelect>(
          (contractType) => ({
            id: contractType.id,
            name: contractType.name,
            description: contractType.description,
          })
        )
  }

  async findOne(
    req: IdRequest
  ): Promise<typeof sqliteContractTypesTable.$inferSelect> {
    const { id } = await idSchema.parseAsync(req)

    const contractType = await contractTypeRepository.findOne(id)
    if (!contractType)
      throw new ContractTypeNotFoundError('El tipo de contrato no existe')

    return {
      id: contractType.id,
      name: contractType.name,
      description: contractType.description,
    }
  }
}
