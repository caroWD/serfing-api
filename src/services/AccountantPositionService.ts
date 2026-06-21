import type { sqliteAccountantPositionsTable } from '../db/schemas/index.js'
import {
  AccountantPosition,
  AccountantPositionAlreadyExistsError,
  AccountantPositionNotFoundError,
} from '../models/index.js'
import { SqliteAccountantPositionRepository } from '../repositories/index.js'
import {
  baseSchema,
  idSchema,
  type BaseRequest,
  type IdRequest,
} from '../schemas/index.js'

const accountantPositionRepository = new SqliteAccountantPositionRepository()

export class AccountantPositionService {
  async add(req: BaseRequest): Promise<void> {
    const { id, name, description } = await baseSchema.parseAsync(req)

    const accountantPositionExists =
      await accountantPositionRepository.ensureAlreadyExists(name)
    if (accountantPositionExists)
      throw new AccountantPositionAlreadyExistsError(
        'El cargo de contador ya existe'
      )

    return await accountantPositionRepository.add(
      new AccountantPosition(id, name, description)
    )
  }

  async edit(req: BaseRequest): Promise<void> {
    const { id, name, description } = await baseSchema.parseAsync(req)

    const accountantPositionToEdit =
      await accountantPositionRepository.findOne(id)
    if (!accountantPositionToEdit)
      throw new AccountantPositionNotFoundError(
        'El cargo de contador no existe'
      )

    if (name !== accountantPositionToEdit.name) {
      const accountantPositionExists =
        await accountantPositionRepository.ensureAlreadyExists(name)
      if (accountantPositionExists)
        throw new AccountantPositionAlreadyExistsError(
          'El cargo de contador ya existe'
        )
    }

    return await accountantPositionRepository.edit(
      new AccountantPosition(accountantPositionToEdit.id, name, description)
    )
  }

  async remove(req: IdRequest): Promise<void> {
    const { id } = await idSchema.parseAsync(req)

    const accountantPositionToRemove =
      await accountantPositionRepository.findOne(id)
    if (!accountantPositionToRemove)
      throw new AccountantPositionNotFoundError(
        'El cargo de contador no existe'
      )

    return await accountantPositionRepository.remove(
      accountantPositionToRemove.id
    )
  }

  async findAll(): Promise<
    (typeof sqliteAccountantPositionsTable.$inferSelect)[]
  > {
    const accountantPositions = await accountantPositionRepository.findAll()

    return !accountantPositions.length
      ? []
      : accountantPositions.map<
          typeof sqliteAccountantPositionsTable.$inferSelect
        >((accountantPosition) => ({
          id: accountantPosition.id,
          name: accountantPosition.name,
          description: accountantPosition.description,
        }))
  }

  async findOne(
    req: IdRequest
  ): Promise<typeof sqliteAccountantPositionsTable.$inferSelect> {
    const { id } = await idSchema.parseAsync(req)

    const accountantPositionFinded =
      await accountantPositionRepository.findOne(id)
    if (!accountantPositionFinded)
      throw new AccountantPositionNotFoundError(
        'El cargo de contador no existe'
      )

    return {
      id: accountantPositionFinded.id,
      name: accountantPositionFinded.name,
      description: accountantPositionFinded.description,
    }
  }
}
