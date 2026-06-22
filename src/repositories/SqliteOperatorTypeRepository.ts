import { eq } from 'drizzle-orm'
import { sqliteOperatorTypesTable } from '../db/schemas/index.js'
import type { IBaseRepository } from '../interfaces/index.js'
import { OperatorType } from '../models/index.js'
import { baseSchema } from '../schemas/index.js'
import { sqlite } from './databases.js'

export class SqliteOperatorTypeRepository implements IBaseRepository<OperatorType> {
  async add(entity: OperatorType): Promise<void> {
    const operatorType = await this.mapToOperatorTypeInsert(entity)

    const { rowsAffected } = await sqlite
      .insert(sqliteOperatorTypesTable)
      .values(operatorType)

    if (!rowsAffected) throw new Error('Algo salio mal')
  }

  async edit(entity: OperatorType): Promise<void> {
    const operatorType = await this.mapToOperatorTypeInsert(entity)

    const { rowsAffected } = await sqlite
      .update(sqliteOperatorTypesTable)
      .set({
        name: operatorType.name,
        description: operatorType.description,
      })
      .where(eq(sqliteOperatorTypesTable.id, operatorType.id))

    if (!rowsAffected) throw new Error('Algo salio mal')
  }

  async remove(id: string): Promise<void> {
    const { rowsAffected } = await sqlite
      .delete(sqliteOperatorTypesTable)
      .where(eq(sqliteOperatorTypesTable.id, id))

    if (!rowsAffected) throw new Error('Algo salio mal')
  }

  async findAll(): Promise<OperatorType[]> {
    const operatorTypes = await sqlite.select().from(sqliteOperatorTypesTable)

    return !operatorTypes.length
      ? []
      : await Promise.all(
          operatorTypes.map(
            async (operatorType) => await this.mapToOperatorType(operatorType)
          )
        )
  }

  async findOne(id: string): Promise<OperatorType | null> {
    const [operatorType] = await sqlite
      .select()
      .from(sqliteOperatorTypesTable)
      .where(eq(sqliteOperatorTypesTable.id, id))

    return !operatorType ? null : await this.mapToOperatorType(operatorType)
  }

  async ensureAlreadyExists(name: string): Promise<boolean> {
    const [exists] = await sqlite
      .select({ name: sqliteOperatorTypesTable.name })
      .from(sqliteOperatorTypesTable)
      .where(eq(sqliteOperatorTypesTable.name, name))

    return !exists ? false : true
  }

  private async mapToOperatorTypeInsert(
    operatorType: OperatorType
  ): Promise<typeof sqliteOperatorTypesTable.$inferInsert> {
    return {
      id: operatorType.id,
      name: operatorType.name,
      description: operatorType.description,
    }
  }

  private async mapToOperatorType(
    operatorType: typeof sqliteOperatorTypesTable.$inferInsert
  ): Promise<OperatorType> {
    const operatorTypeParsed = await baseSchema.parseAsync(operatorType)

    return new OperatorType(
      operatorTypeParsed.id,
      operatorTypeParsed.name,
      operatorTypeParsed.description
    )
  }
}
