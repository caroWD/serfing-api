import { eq } from 'drizzle-orm'
import {
  sqliteCollaboratorsTable,
  sqliteUsersTable,
} from '../db/schemas/index.js'
import type { IUsersRepository } from '../interfaces/index.js'
import { Collaborator } from '../models/index.js'
import { sqlite } from './databases.js'
import { genSalt, hash } from 'bcryptjs'
import { SALT_ROUNDS } from '../config/index.js'
import { getTemporalFrom } from '../helpers/index.js'
import type { CollaboratorSelect } from '../schemas/user-schema.js'

export class SqliteCollaboratorRepository implements IUsersRepository<Collaborator> {
  async add(user: Collaborator): Promise<void> {
    const collaborator = await this.mapToCollaboratorInsert(user)

    const userResult = await sqlite
      .insert(sqliteUsersTable)
      .values(collaborator.user)

    if (!userResult.rowsAffected) throw new Error('Algo salio mal')

    const collaboratorResult = await sqlite
      .insert(sqliteCollaboratorsTable)
      .values(collaborator.collaborator)

    if (!collaboratorResult.rowsAffected) throw new Error('Algo salio mal')
  }

  async edit(user: Collaborator): Promise<void> {
    const collaborator = await this.mapToCollaboratorInsert(user)

    const userResult = await sqlite
      .update(sqliteUsersTable)
      .set({
        handle: collaborator.user.handle,
        firstName: collaborator.user.firstName,
        lastName: collaborator.user.firstName,
        email: collaborator.user.email,
        roleId: collaborator.user.roleId,
        state: collaborator.user.state,
        updatedAt: collaborator.user.updatedAt,
      })
      .where(eq(sqliteUsersTable.id, collaborator.user.id))

    if (!userResult.rowsAffected) throw new Error('Algo salio mal')

    const collaboratorResult = await sqlite
      .update(sqliteCollaboratorsTable)
      .set({
        salary: collaborator.collaborator.salary,
        yearsExperience: collaborator.collaborator.yearsExperience,
        hierarcyId: collaborator.collaborator.hierarcyId,
        businessAreaId: collaborator.collaborator.businessAreaId,
        educationDegreeId: collaborator.collaborator.educationDegreeId,
        contractTypeId: collaborator.collaborator.contractTypeId,
      })
      .where(
        eq(sqliteCollaboratorsTable.userId, collaborator.collaborator.userId)
      )

    if (!collaboratorResult.rowsAffected) throw new Error('Algo salio mal')
  }

  async remove(id: string): Promise<void> {
    const collaboratorResult = await sqlite
      .delete(sqliteCollaboratorsTable)
      .where(eq(sqliteCollaboratorsTable.userId, id))

    if (!collaboratorResult.rowsAffected) throw new Error('Algo salio mal')

    const userResult = await sqlite
      .delete(sqliteUsersTable)
      .where(eq(sqliteUsersTable.id, id))

    if (!userResult.rowsAffected) throw new Error('Algo salio mal')
  }

  async findAll(): Promise<Collaborator[]> {
    const collaborators = await sqlite
      .select({
        id: sqliteUsersTable.id,
        handle: sqliteUsersTable.handle,
        firstName: sqliteUsersTable.firstName,
        lastName: sqliteUsersTable.lastName,
        email: sqliteUsersTable.email,
        password: sqliteUsersTable.password,
        state: sqliteUsersTable.state,
        roleId: sqliteUsersTable.roleId,
        salary: sqliteCollaboratorsTable.salary,
        yearsExperience: sqliteCollaboratorsTable.yearsExperience,
        hierarcyId: sqliteCollaboratorsTable.hierarcyId,
        businessAreaId: sqliteCollaboratorsTable.businessAreaId,
        educationDegreeId: sqliteCollaboratorsTable.educationDegreeId,
        contractTypeId: sqliteCollaboratorsTable.contractTypeId,
        createdAt: sqliteUsersTable.createdAt,
        updatedAt: sqliteUsersTable.updatedAt,
        deletedAt: sqliteUsersTable.deletedAt,
      })
      .from(sqliteUsersTable)
      .innerJoin(
        sqliteCollaboratorsTable,
        eq(sqliteUsersTable.id, sqliteCollaboratorsTable.userId)
      )

    return !collaborators.length
      ? []
      : await Promise.all(
          collaborators.map(
            async (collaborator) => await this.mapToCollaborator(collaborator)
          )
        )
  }

  async findOne(id: string): Promise<Collaborator | null> {
    const [collaborator] = await sqlite
      .select({
        id: sqliteUsersTable.id,
        handle: sqliteUsersTable.handle,
        firstName: sqliteUsersTable.firstName,
        lastName: sqliteUsersTable.lastName,
        email: sqliteUsersTable.email,
        password: sqliteUsersTable.password,
        state: sqliteUsersTable.state,
        roleId: sqliteUsersTable.roleId,
        salary: sqliteCollaboratorsTable.salary,
        yearsExperience: sqliteCollaboratorsTable.yearsExperience,
        hierarcyId: sqliteCollaboratorsTable.hierarcyId,
        businessAreaId: sqliteCollaboratorsTable.businessAreaId,
        educationDegreeId: sqliteCollaboratorsTable.educationDegreeId,
        contractTypeId: sqliteCollaboratorsTable.contractTypeId,
        createdAt: sqliteUsersTable.createdAt,
        updatedAt: sqliteUsersTable.updatedAt,
        deletedAt: sqliteUsersTable.deletedAt,
      })
      .from(sqliteUsersTable)
      .innerJoin(
        sqliteCollaboratorsTable,
        eq(sqliteUsersTable.id, sqliteCollaboratorsTable.userId)
      )
      .where(eq(sqliteUsersTable.id, id))

    return !collaborator ? null : await this.mapToCollaborator(collaborator)
  }

  private async mapToCollaboratorInsert(collaborator: Collaborator): Promise<{
    user: typeof sqliteUsersTable.$inferInsert
    collaborator: typeof sqliteCollaboratorsTable.$inferInsert
  }> {
    return {
      user: {
        id: collaborator.id,
        handle: collaborator.handle,
        firstName: collaborator.firstName,
        lastName: collaborator.lastName,
        email: collaborator.email,
        password: collaborator.password,
        state: collaborator.state,
        roleId: collaborator.roleId,
        createdAt: collaborator.createdAt.toJSON(),
        updatedAt: collaborator.updatedAt.toJSON(),
        deletedAt: collaborator.deletedAt?.toJSON() || null,
      },
      collaborator: {
        userId: collaborator.id,
        salary: collaborator.salary,
        yearsExperience: collaborator.yearsExperience,
        hierarcyId: collaborator.hierarchyId,
        businessAreaId: collaborator.businessAreaId,
        educationDegreeId: collaborator.educationDegreeId,
        contractTypeId: collaborator.contractTypeId,
      },
    }
  }

  private async mapToCollaborator(
    collaborator: CollaboratorSelect
  ): Promise<Collaborator> {
    return new Collaborator(
      collaborator.id,
      collaborator.handle,
      collaborator.firstName,
      collaborator.lastName,
      collaborator.email,
      await hash(collaborator.password, await genSalt(Number(SALT_ROUNDS))),
      collaborator.salary,
      collaborator.yearsExperience,
      collaborator.hierarcyId,
      collaborator.businessAreaId,
      collaborator.educationDegreeId,
      collaborator.contractTypeId,
      collaborator.state,
      collaborator.roleId,
      getTemporalFrom(collaborator.createdAt),
      getTemporalFrom(collaborator.updatedAt),
      !collaborator.deletedAt ? null : getTemporalFrom(collaborator.deletedAt)
    )
  }
}
