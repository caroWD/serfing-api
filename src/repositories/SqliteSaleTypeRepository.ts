import { eq } from 'drizzle-orm'
import { sqliteSaleTypesTable } from '../db/schemas/index.js'
import type { IBaseRepository } from '../interfaces/index.js'
import { SaleType } from '../models/index.js'
import { baseSchema } from '../schemas/index.js'
import { sqlite } from './databases.js'

export class SqliteSaleTypeRepository implements IBaseRepository<SaleType> {
  async add(entity: SaleType): Promise<void> {
    const saleType = await this.mapToSaleTypeInsert(entity)

    const { rowsAffected } = await sqlite
      .insert(sqliteSaleTypesTable)
      .values(saleType)

    if (!rowsAffected) throw new Error('Algo salio mal')
  }

  async edit(entity: SaleType): Promise<void> {
    const saleType = await this.mapToSaleTypeInsert(entity)

    const { rowsAffected } = await sqlite
      .update(sqliteSaleTypesTable)
      .set({
        name: saleType.name,
        description: saleType.description,
      })
      .where(eq(sqliteSaleTypesTable.id, saleType.id))

    if (!rowsAffected) throw new Error('Algo salio mal')
  }

  async remove(id: string): Promise<void> {
    const { rowsAffected } = await sqlite
      .delete(sqliteSaleTypesTable)
      .where(eq(sqliteSaleTypesTable.id, id))

    if (!rowsAffected) throw new Error('Algo salio mal')
  }

  async findAll(): Promise<SaleType[]> {
    const saleTypes = await sqlite.select().from(sqliteSaleTypesTable)

    return !saleTypes.length
      ? []
      : await Promise.all(
          saleTypes.map(async (saleType) => await this.mapToSaleType(saleType))
        )
  }

  async findOne(id: string): Promise<SaleType | null> {
    const [saleType] = await sqlite
      .select()
      .from(sqliteSaleTypesTable)
      .where(eq(sqliteSaleTypesTable.id, id))

    return !saleType ? null : await this.mapToSaleType(saleType)
  }

  async ensureAlreadyExists(name: string): Promise<boolean> {
    const [exists] = await sqlite
      .select({ name: sqliteSaleTypesTable.name })
      .from(sqliteSaleTypesTable)
      .where(eq(sqliteSaleTypesTable.name, name))

    return !exists ? false : true
  }

  private async mapToSaleTypeInsert(
    saleType: SaleType
  ): Promise<typeof sqliteSaleTypesTable.$inferInsert> {
    return {
      id: saleType.id,
      name: saleType.name,
      description: saleType.description,
    }
  }

  private async mapToSaleType(
    saleType: typeof sqliteSaleTypesTable.$inferSelect
  ): Promise<SaleType> {
    const saleTypeParsed = await baseSchema.parseAsync(saleType)

    return new SaleType(
      saleTypeParsed.id,
      saleTypeParsed.name,
      saleTypeParsed.description
    )
  }
}
