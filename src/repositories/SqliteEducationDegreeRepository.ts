import { eq } from 'drizzle-orm'
import { sqliteEducationDegreesTable } from '../db/schemas/index.js'
import type { IBaseRepository } from '../interfaces/index.js'
import { EducationDegree } from '../models/index.js'
import { baseSchema } from '../schemas/index.js'
import { sqlite } from './databases.js'

export class SqliteEducationDegreeRepository implements IBaseRepository<EducationDegree> {
  async add(entity: EducationDegree): Promise<void> {
    const educationDegree = await this.mapToEducationDegreeInsert(entity)

    const { rowsAffected } = await sqlite
      .insert(sqliteEducationDegreesTable)
      .values(educationDegree)

    if (!rowsAffected) throw new Error('Algo salio mal')
  }

  async edit(entity: EducationDegree): Promise<void> {
    const educationDegree = await this.mapToEducationDegreeInsert(entity)

    const { rowsAffected } = await sqlite
      .update(sqliteEducationDegreesTable)
      .set({
        name: educationDegree.name,
        description: educationDegree.description,
      })
      .where(eq(sqliteEducationDegreesTable.id, educationDegree.id))

    if (!rowsAffected) throw new Error('Algo salio mal')
  }

  async remove(id: string): Promise<void> {
    const { rowsAffected } = await sqlite
      .delete(sqliteEducationDegreesTable)
      .where(eq(sqliteEducationDegreesTable.id, id))

    if (!rowsAffected) throw new Error('Algo salio mal')
  }

  async findAll(): Promise<EducationDegree[]> {
    const educationDegrees = await sqlite
      .select()
      .from(sqliteEducationDegreesTable)

    return !educationDegrees.length
      ? []
      : await Promise.all(
          educationDegrees.map(
            async (educationDegree) =>
              await this.mapToEducationDegree(educationDegree)
          )
        )
  }

  async findOne(id: string): Promise<EducationDegree | null> {
    const [educationDegree] = await sqlite
      .select()
      .from(sqliteEducationDegreesTable)
      .where(eq(sqliteEducationDegreesTable.id, id))

    return !educationDegree
      ? null
      : await this.mapToEducationDegree(educationDegree)
  }

  async ensureAlreadyExists(name: string): Promise<boolean> {
    const [exists] = await sqlite
      .select({ name: sqliteEducationDegreesTable.name })
      .from(sqliteEducationDegreesTable)
      .where(eq(sqliteEducationDegreesTable.name, name))

    return !exists ? false : true
  }

  private async mapToEducationDegreeInsert(
    educationDegree: EducationDegree
  ): Promise<typeof sqliteEducationDegreesTable.$inferInsert> {
    return {
      id: educationDegree.id,
      name: educationDegree.name,
      description: educationDegree.description,
    }
  }

  private async mapToEducationDegree(
    educationDegree: typeof sqliteEducationDegreesTable.$inferSelect
  ): Promise<EducationDegree> {
    const educationDegreeParsed = await baseSchema.parseAsync(educationDegree)

    return new EducationDegree(
      educationDegreeParsed.id,
      educationDegreeParsed.name,
      educationDegreeParsed.description
    )
  }
}
