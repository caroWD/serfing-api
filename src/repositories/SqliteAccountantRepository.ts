import { genSalt, hash } from 'bcryptjs'
import {
  sqliteAccountantsTable,
  sqliteCollaboratorsTable,
  sqliteUsersTable,
} from '../db/schemas/index.js'
import type { IUsersRepository } from '../interfaces/index.js'
import { Accountant } from '../models/index.js'
import { SALT_ROUNDS } from '../config/index.js'
import { getTemporalFrom } from '../helpers/index.js'
import { sqlite } from './databases.js'
import { eq } from 'drizzle-orm'

type AccountantInsert = {
  users: typeof sqliteUsersTable.$inferInsert
  collaborators: typeof sqliteCollaboratorsTable.$inferInsert
  accountants: typeof sqliteAccountantsTable.$inferInsert
}

type AccountantSelect = {
  users: typeof sqliteUsersTable.$inferSelect
  collaborators: typeof sqliteCollaboratorsTable.$inferSelect
  accountants: typeof sqliteAccountantsTable.$inferSelect
}

export class SqliteAccountantRepository implements IUsersRepository<Accountant> {
  async add(user: Accountant): Promise<void> {
    const { users, collaborators, accountants } =
      await this.mapToAccountantInsert(user)

    const userResult = await sqlite.insert(sqliteUsersTable).values(users)

    if (!userResult.rowsAffected) throw new Error('Algo salio mal')

    const collaboratorResult = await sqlite
      .insert(sqliteCollaboratorsTable)
      .values(collaborators)

    if (!collaboratorResult.rowsAffected) throw new Error('Algo salio mal')

    const accountantResult = await sqlite
      .insert(sqliteAccountantsTable)
      .values(accountants)

    if (!accountantResult.rowsAffected) throw new Error('Algo salio mal')
  }

  async edit(user: Accountant): Promise<void> {
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
      accountants: { accountantPositionId },
    } = await this.mapToAccountantInsert(user)

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

    const accountantResult = await sqlite
      .update(sqliteAccountantsTable)
      .set({ accountantPositionId })
      .where(eq(sqliteAccountantsTable.userId, id))

    if (!accountantResult.rowsAffected) throw new Error('Algo salio mal')
  }

  async remove(id: string): Promise<void> {
    const accountantResult = await sqlite
      .delete(sqliteAccountantsTable)
      .where(eq(sqliteAccountantsTable.userId, id))

    if (!accountantResult.rowsAffected) throw new Error('Algo salio mal')

    const collaboratorResult = await sqlite
      .delete(sqliteCollaboratorsTable)
      .where(eq(sqliteCollaboratorsTable.userId, id))

    if (!collaboratorResult.rowsAffected) throw new Error('Algo salio mal')

    const userResult = await sqlite
      .delete(sqliteUsersTable)
      .where(eq(sqliteUsersTable.id, id))

    if (!userResult.rowsAffected) throw new Error('Algo salio mal')
  }

  async findAll(): Promise<Accountant[]> {
    const accountants = await sqlite
      .select()
      .from(sqliteUsersTable)
      .innerJoin(
        sqliteCollaboratorsTable,
        eq(sqliteUsersTable.id, sqliteCollaboratorsTable.userId)
      )
      .innerJoin(
        sqliteAccountantsTable,
        eq(sqliteUsersTable.id, sqliteAccountantsTable.userId)
      )

    return !accountants.length
      ? []
      : await Promise.all(
          accountants.map(
            async (accountant) => await this.mapToAccountant(accountant)
          )
        )
  }

  async findOne(id: string): Promise<Accountant | null> {
    const [accountant] = await sqlite
      .select()
      .from(sqliteUsersTable)
      .innerJoin(
        sqliteCollaboratorsTable,
        eq(sqliteUsersTable.id, sqliteCollaboratorsTable.userId)
      )
      .innerJoin(
        sqliteAccountantsTable,
        eq(sqliteUsersTable.id, sqliteAccountantsTable.userId)
      )
      .where(eq(sqliteUsersTable.id, id))

    return !accountant ? null : await this.mapToAccountant(accountant)
  }

  private async mapToAccountantInsert(
    accountant: Accountant
  ): Promise<AccountantInsert> {
    return {
      users: {
        id: accountant.id,
        handle: accountant.handle,
        firstName: accountant.firstName,
        lastName: accountant.lastName,
        email: accountant.email,
        password: await hash(
          accountant.password,
          await genSalt(Number(SALT_ROUNDS))
        ),
        roleId: accountant.roleId,
        state: accountant.state,
        createdAt: accountant.createdAt.toJSON(),
        updatedAt: accountant.updatedAt.toJSON(),
        deletedAt: accountant.deletedAt?.toJSON() || null,
      },
      collaborators: {
        userId: accountant.id,
        salary: accountant.salary,
        yearsExperience: accountant.yearsExperience,
        hierarcyId: accountant.hierarchyId,
        businessAreaId: accountant.businessAreaId,
        educationDegreeId: accountant.educationDegreeId,
        contractTypeId: accountant.contractTypeId,
      },
      accountants: {
        userId: accountant.id,
        accountantPositionId: accountant.accountantPositionId,
      },
    }
  }

  private async mapToAccountant(
    accountant: AccountantSelect
  ): Promise<Accountant> {
    return new Accountant(
      accountant.users.id,
      accountant.users.handle,
      accountant.users.firstName,
      accountant.users.lastName,
      accountant.users.email,
      accountant.users.password,
      accountant.collaborators.salary,
      accountant.collaborators.yearsExperience,
      accountant.collaborators.hierarcyId,
      accountant.collaborators.businessAreaId,
      accountant.collaborators.educationDegreeId,
      accountant.collaborators.contractTypeId,
      accountant.accountants.accountantPositionId,
      accountant.users.state,
      accountant.users.roleId,
      getTemporalFrom(accountant.users.createdAt),
      getTemporalFrom(accountant.users.updatedAt),
      !accountant.users.deletedAt
        ? null
        : getTemporalFrom(accountant.users.deletedAt)
    )
  }
}
