import { eq } from 'drizzle-orm'
import { sqliteBusinessAreasTable } from '../db/schemas/index.js'
import type { IBaseRepository } from '../interfaces/index.js'
import { BusinessArea } from '../models/index.js'
import { baseSchema } from '../schemas/index.js'
import { sqlite } from './databases.js'

export class SqliteBusinessAreaRepository implements IBaseRepository<BusinessArea> {
  async add(entity: BusinessArea): Promise<void> {
    const businessArea = await this.mapToBusinessAreaInsert(entity)

    const { rowsAffected } = await sqlite
      .insert(sqliteBusinessAreasTable)
      .values(businessArea)

    if (!rowsAffected) throw new Error('Algo salio mal')
  }

  async edit(entity: BusinessArea): Promise<void> {
    const businessArea = await this.mapToBusinessAreaInsert(entity)

    const { rowsAffected } = await sqlite
      .update(sqliteBusinessAreasTable)
      .set({
        name: businessArea.name,
        description: businessArea.description,
      })
      .where(eq(sqliteBusinessAreasTable.id, businessArea.id))

    if (!rowsAffected) throw new Error('Algo salio mal')
  }

  async remove(id: string): Promise<void> {
    const { rowsAffected } = await sqlite
      .delete(sqliteBusinessAreasTable)
      .where(eq(sqliteBusinessAreasTable.id, id))

    if (!rowsAffected) throw new Error('Algo salio mal')
  }

  async findAll(): Promise<BusinessArea[]> {
    const businessAreas = await sqlite.select().from(sqliteBusinessAreasTable)

    return !businessAreas.length
      ? []
      : await Promise.all(
          businessAreas.map(
            async (businessArea) => await this.mapToBusinessArea(businessArea)
          )
        )
  }

  async findOne(id: string): Promise<BusinessArea | null> {
    const [businessArea] = await sqlite
      .select()
      .from(sqliteBusinessAreasTable)
      .where(eq(sqliteBusinessAreasTable.id, id))

    return !businessArea ? null : await this.mapToBusinessArea(businessArea)
  }

  async ensureAlreadyExists(name: string): Promise<boolean> {
    const [exists] = await sqlite
      .select({ name: sqliteBusinessAreasTable.name })
      .from(sqliteBusinessAreasTable)
      .where(eq(sqliteBusinessAreasTable.name, name))

    return !exists ? false : true
  }

  private async mapToBusinessAreaInsert(
    businessArea: BusinessArea
  ): Promise<typeof sqliteBusinessAreasTable.$inferInsert> {
    return {
      id: businessArea.id,
      name: businessArea.name,
      description: businessArea.description,
    }
  }

  private async mapToBusinessArea(
    businessArea: typeof sqliteBusinessAreasTable.$inferInsert
  ): Promise<BusinessArea> {
    const businessAreaParsed = await baseSchema.parseAsync(businessArea)

    return new BusinessArea(
      businessAreaParsed.id,
      businessAreaParsed.name,
      businessAreaParsed.description
    )
  }
}
