import { eq } from 'drizzle-orm'
import { sqliteEngineerPositionsTable } from '../db/schemas/index.js'
import type { IBaseRepository } from '../interfaces/index.js'
import { EngineerPosition } from '../models/index.js'
import { baseSchema } from '../schemas/index.js'
import { sqlite } from './databases.js'

export class SqliteEngineerPositionRepository implements IBaseRepository<EngineerPosition> {
  async add(entity: EngineerPosition): Promise<void> {
    const engineerPosition = await this.mapToEngineerPositionInsert(entity)

    const { rowsAffected } = await sqlite
      .insert(sqliteEngineerPositionsTable)
      .values(engineerPosition)

    if (!rowsAffected) throw new Error('Algo salio mal')
  }

  async edit(entity: EngineerPosition): Promise<void> {
    const engineerPosition = await this.mapToEngineerPositionInsert(entity)

    const { rowsAffected } = await sqlite
      .update(sqliteEngineerPositionsTable)
      .set({
        name: engineerPosition.name,
        description: engineerPosition.description,
      })
      .where(eq(sqliteEngineerPositionsTable.id, engineerPosition.id))

    if (!rowsAffected) throw new Error('Algo salio mal')
  }

  async remove(id: string): Promise<void> {
    const { rowsAffected } = await sqlite
      .delete(sqliteEngineerPositionsTable)
      .where(eq(sqliteEngineerPositionsTable.id, id))

    if (!rowsAffected) throw new Error('Algo salio mal')
  }

  async findAll(): Promise<EngineerPosition[]> {
    const engineerPositions = await sqlite
      .select()
      .from(sqliteEngineerPositionsTable)

    return !engineerPositions.length
      ? []
      : await Promise.all(
          engineerPositions.map(
            async (engineerPosition) =>
              await this.mapToEngineerPosition(engineerPosition)
          )
        )
  }

  async findOne(id: string): Promise<EngineerPosition | null> {
    const [engineerPosition] = await sqlite
      .select()
      .from(sqliteEngineerPositionsTable)
      .where(eq(sqliteEngineerPositionsTable.id, id))

    return !engineerPosition
      ? null
      : await this.mapToEngineerPosition(engineerPosition)
  }

  async ensureAlreadyExists(name: string): Promise<boolean> {
    const [exists] = await sqlite
      .select({ name: sqliteEngineerPositionsTable.name })
      .from(sqliteEngineerPositionsTable)
      .where(eq(sqliteEngineerPositionsTable.name, name))

    return !exists ? false : true
  }

  private async mapToEngineerPositionInsert(
    engineerPosition: EngineerPosition
  ): Promise<typeof sqliteEngineerPositionsTable.$inferInsert> {
    return {
      id: engineerPosition.id,
      name: engineerPosition.name,
      description: engineerPosition.description,
    }
  }

  private async mapToEngineerPosition(
    engineerPosition: typeof sqliteEngineerPositionsTable.$inferSelect
  ): Promise<EngineerPosition> {
    const engineerPositionParsed = await baseSchema.parseAsync(engineerPosition)

    return new EngineerPosition(
      engineerPositionParsed.id,
      engineerPositionParsed.name,
      engineerPositionParsed.description
    )
  }
}
