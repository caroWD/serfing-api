import { eq } from 'drizzle-orm'
import { sqliteHierarciesTable } from '../db/schemas/index.js'
import type { IBaseRepository } from '../interfaces/index.js'
import { Hierarchy } from '../models/index.js'
import { baseSchema } from '../schemas/index.js'
import { sqlite } from './databases.js'

export class SqliteHierarchyRepository implements IBaseRepository<Hierarchy> {
  async add(entity: Hierarchy): Promise<void> {
    const hierarchy = await this.mapToHierarchyInsert(entity)

    const { rowsAffected } = await sqlite
      .insert(sqliteHierarciesTable)
      .values(hierarchy)

    if (!rowsAffected) throw new Error('Algo salio mal')
  }

  async edit(entity: Hierarchy): Promise<void> {
    const hierarchy = await this.mapToHierarchyInsert(entity)

    const { rowsAffected } = await sqlite
      .update(sqliteHierarciesTable)
      .set({
        name: hierarchy.name,
        description: hierarchy.description,
      })
      .where(eq(sqliteHierarciesTable.id, hierarchy.id))

    if (!rowsAffected) throw new Error('Algo salio mal')
  }

  async remove(id: string): Promise<void> {
    const { rowsAffected } = await sqlite
      .delete(sqliteHierarciesTable)
      .where(eq(sqliteHierarciesTable.id, id))

    if (!rowsAffected) throw new Error('Algo salio mal')
  }

  async findAll(): Promise<Hierarchy[]> {
    const hierarcies = await sqlite.select().from(sqliteHierarciesTable)

    return !hierarcies.length
      ? []
      : await Promise.all(
          hierarcies.map(
            async (hierarchy) => await this.mapToHierarchy(hierarchy)
          )
        )
  }

  async findOne(id: string): Promise<Hierarchy | null> {
    const [hierarchy] = await sqlite
      .select()
      .from(sqliteHierarciesTable)
      .where(eq(sqliteHierarciesTable.id, id))

    return !hierarchy ? null : await this.mapToHierarchy(hierarchy)
  }

  async ensureAlreadyExists(name: string): Promise<boolean> {
    const [exists] = await sqlite
      .select({ name: sqliteHierarciesTable.name })
      .from(sqliteHierarciesTable)
      .where(eq(sqliteHierarciesTable.name, name))

    return !exists ? false : true
  }

  private async mapToHierarchyInsert(
    hierarchy: Hierarchy
  ): Promise<typeof sqliteHierarciesTable.$inferInsert> {
    return {
      id: hierarchy.id,
      name: hierarchy.name,
      description: hierarchy.description,
    }
  }

  private async mapToHierarchy(
    hierarchy: typeof sqliteHierarciesTable.$inferSelect
  ): Promise<Hierarchy> {
    const hierarchyParsed = await baseSchema.parseAsync(hierarchy)

    return new Hierarchy(
      hierarchyParsed.id,
      hierarchyParsed.name,
      hierarchyParsed.description
    )
  }
}
