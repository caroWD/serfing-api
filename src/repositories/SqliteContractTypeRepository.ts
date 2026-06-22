import { eq } from 'drizzle-orm'
import { sqliteContractTypesTable } from '../db/schemas/index.js'
import type { IBaseRepository } from '../interfaces/index.js'
import { ContractType } from '../models/index.js'
import { baseSchema } from '../schemas/index.js'
import { sqlite } from './databases.js'

export class SqliteContractTypeRepository implements IBaseRepository<ContractType> {
  async add(entity: ContractType): Promise<void> {
    const contractType = await this.mapToContractTypeInsert(entity)

    const { rowsAffected } = await sqlite
      .insert(sqliteContractTypesTable)
      .values(contractType)

    if (!rowsAffected) throw new Error('Algo salio mal')
  }

  async edit(entity: ContractType): Promise<void> {
    const contractType = await this.mapToContractTypeInsert(entity)

    const { rowsAffected } = await sqlite
      .update(sqliteContractTypesTable)
      .set({})
      .where(eq(sqliteContractTypesTable.id, contractType.id))

    if (!rowsAffected) throw new Error('Algo salio mal')
  }

  async remove(id: string): Promise<void> {
    const { rowsAffected } = await sqlite
      .delete(sqliteContractTypesTable)
      .where(eq(sqliteContractTypesTable.id, id))

    if (!rowsAffected) throw new Error('Algo salio mal')
  }

  async findAll(): Promise<ContractType[]> {
    const contractTypes = await sqlite.select().from(sqliteContractTypesTable)

    return !contractTypes.length
      ? []
      : Promise.all(
          contractTypes.map(
            async (contractType) => await this.mapToContractType(contractType)
          )
        )
  }

  async findOne(id: string): Promise<ContractType | null> {
    const [contractType] = await sqlite
      .select()
      .from(sqliteContractTypesTable)
      .where(eq(sqliteContractTypesTable.id, id))

    return !contractType ? null : await this.mapToContractType(contractType)
  }

  async ensureAlreadyExists(name: string): Promise<boolean> {
    const [exists] = await sqlite
      .select({ name: sqliteContractTypesTable.name })
      .from(sqliteContractTypesTable)
      .where(eq(sqliteContractTypesTable.name, name))

    return !exists ? false : true
  }

  private async mapToContractTypeInsert(
    contractType: ContractType
  ): Promise<typeof sqliteContractTypesTable.$inferInsert> {
    return {
      id: contractType.id,
      name: contractType.name,
      description: contractType.description,
    }
  }

  private async mapToContractType(
    contractType: typeof sqliteContractTypesTable.$inferSelect
  ): Promise<ContractType> {
    const contractTypeParsed = await baseSchema.parseAsync(contractType)

    return new ContractType(
      contractTypeParsed.id,
      contractTypeParsed.name,
      contractTypeParsed.description
    )
  }
}
