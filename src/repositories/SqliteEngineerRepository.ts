import { genSalt, hash } from 'bcryptjs'
import {
  sqliteCollaboratorsTable,
  sqliteEngineersTable,
  sqliteUsersTable,
} from '../db/schemas/index.js'
import type { IUsersRepository } from '../interfaces/index.js'
import { Engineer } from '../models/index.js'
import { SALT_ROUNDS } from '../config/index.js'
import { getTemporalFrom } from '../helpers/index.js'
import { sqlite } from './databases.js'
import { eq } from 'drizzle-orm'

type EngineerInsert = {
  users: typeof sqliteUsersTable.$inferInsert
  collaborators: typeof sqliteCollaboratorsTable.$inferInsert
  engineers: typeof sqliteEngineersTable.$inferInsert
}

type EngineerSelect = {
  users: typeof sqliteUsersTable.$inferSelect
  collaborators: typeof sqliteCollaboratorsTable.$inferSelect
  engineers: typeof sqliteEngineersTable.$inferSelect
}

export class SqliteEngineerRepository implements IUsersRepository<Engineer> {
  async add(entity: Engineer): Promise<void> {
    const { users, collaborators, engineers } =
      await this.mapToEngineerInsert(entity)

    const userResult = await sqlite.insert(sqliteUsersTable).values(users)

    if (!userResult.rowsAffected) throw new Error('Algo salio mal')

    const collaboratorResult = await sqlite
      .insert(sqliteCollaboratorsTable)
      .values(collaborators)

    if (!collaboratorResult.rowsAffected) throw new Error('Algo salio mal')

    const engineerResult = await sqlite
      .insert(sqliteEngineersTable)
      .values(engineers)

    if (!engineerResult.rowsAffected) throw new Error('Algo salio mal')
  }

  async edit(entity: Engineer): Promise<void> {
    const {
      users: {
        id,
        handle,
        firstName,
        lastName,
        email,
        state,
        roleId,
        updatedAt,
      },
      collaborators: {
        salary,
        yearsExperience,
        hierarcyId,
        businessAreaId,
        educationDegreeId,
        contractTypeId,
      },
      engineers: { engineerPositionId },
    } = await this.mapToEngineerInsert(entity)

    const userResult = await sqlite
      .update(sqliteUsersTable)
      .set({ handle, firstName, lastName, email, state, roleId, updatedAt })
      .where(eq(sqliteUsersTable.id, id))

    if (!userResult.rowsAffected) throw new Error('Algo salio mal')

    const collaboratorResult = await sqlite
      .update(sqliteCollaboratorsTable)
      .set({
        salary,
        yearsExperience,
        hierarcyId,
        businessAreaId,
        educationDegreeId,
        contractTypeId,
      })
      .where(eq(sqliteCollaboratorsTable.userId, id))

    if (!collaboratorResult.rowsAffected) throw new Error('Algo salio mal')

    const engineerResult = await sqlite
      .update(sqliteEngineersTable)
      .set({ engineerPositionId })
      .where(eq(sqliteEngineersTable.userId, id))

    if (!engineerResult.rowsAffected) throw new Error('Algo salio mal')
  }

  async remove(id: string): Promise<void> {
    const engineerResult = await sqlite
      .delete(sqliteEngineersTable)
      .where(eq(sqliteEngineersTable.userId, id))

    if (!engineerResult.rowsAffected) throw new Error('Algo salio mal')

    const collaboratorResult = await sqlite
      .delete(sqliteCollaboratorsTable)
      .where(eq(sqliteCollaboratorsTable.userId, id))

    if (!collaboratorResult.rowsAffected) throw new Error('Algo salio mal')

    const userResult = await sqlite
      .delete(sqliteUsersTable)
      .where(eq(sqliteUsersTable.id, id))

    if (!userResult.rowsAffected) throw new Error('Algo salio mal')
  }

  async findAll(): Promise<Engineer[]> {
    const engineers = await sqlite
      .select()
      .from(sqliteUsersTable)
      .innerJoin(
        sqliteCollaboratorsTable,
        eq(sqliteUsersTable.id, sqliteCollaboratorsTable.userId)
      )
      .innerJoin(
        sqliteEngineersTable,
        eq(sqliteUsersTable.id, sqliteEngineersTable.userId)
      )

    return !engineers.length
      ? []
      : await Promise.all(
          engineers.map(async (engineer) => await this.mapToEngineer(engineer))
        )
  }

  async findOne(id: string): Promise<Engineer | null> {
    const [engineer] = await sqlite
      .select()
      .from(sqliteUsersTable)
      .innerJoin(
        sqliteCollaboratorsTable,
        eq(sqliteUsersTable.id, sqliteCollaboratorsTable.userId)
      )
      .innerJoin(
        sqliteEngineersTable,
        eq(sqliteUsersTable.id, sqliteEngineersTable.userId)
      )
      .where(eq(sqliteUsersTable.id, id))

    return !engineer ? null : await this.mapToEngineer(engineer)
  }

  private async mapToEngineerInsert(
    engineer: Engineer
  ): Promise<EngineerInsert> {
    return {
      users: {
        id: engineer.id,
        handle: engineer.handle,
        firstName: engineer.firstName,
        lastName: engineer.lastName,
        email: engineer.email,
        password: await hash(
          engineer.password,
          await genSalt(Number(SALT_ROUNDS))
        ),
        roleId: engineer.roleId,
        state: engineer.state,
        createdAt: engineer.createdAt.toJSON(),
        updatedAt: engineer.updatedAt.toJSON(),
        deletedAt: engineer.deletedAt?.toJSON() || null,
      },
      collaborators: {
        userId: engineer.id,
        salary: engineer.salary,
        yearsExperience: engineer.yearsExperience,
        hierarcyId: engineer.hierarchyId,
        businessAreaId: engineer.businessAreaId,
        educationDegreeId: engineer.educationDegreeId,
        contractTypeId: engineer.contractTypeId,
      },
      engineers: {
        userId: engineer.id,
        engineerPositionId: engineer.engineerPositionId,
      },
    }
  }

  private async mapToEngineer(engineer: EngineerSelect): Promise<Engineer> {
    return new Engineer(
      engineer.users.id,
      engineer.users.handle,
      engineer.users.firstName,
      engineer.users.lastName,
      engineer.users.email,
      engineer.users.password,
      engineer.collaborators.salary,
      engineer.collaborators.yearsExperience,
      engineer.collaborators.hierarcyId,
      engineer.collaborators.businessAreaId,
      engineer.collaborators.educationDegreeId,
      engineer.collaborators.contractTypeId,
      engineer.engineers.engineerPositionId,
      engineer.users.state,
      engineer.users.roleId,
      getTemporalFrom(engineer.users.createdAt),
      getTemporalFrom(engineer.users.updatedAt),
      !engineer.users.deletedAt
        ? null
        : getTemporalFrom(engineer.users.deletedAt)
    )
  }
}
