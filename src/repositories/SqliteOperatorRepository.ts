import { genSalt, hash } from 'bcryptjs'
import {
  sqliteCollaboratorsTable,
  sqliteOperatorsTable,
  sqliteUsersTable,
} from '../db/schemas/index.js'
import type { IUsersRepository } from '../interfaces/index.js'
import { Operator } from '../models/index.js'
import { SALT_ROUNDS } from '../config/index.js'
import { getTemporalFrom } from '../helpers/index.js'
import { sqlite } from './databases.js'
import { eq } from 'drizzle-orm'

type OperatorInsert = {
  users: typeof sqliteUsersTable.$inferInsert
  collaborators: typeof sqliteCollaboratorsTable.$inferInsert
  operators: typeof sqliteOperatorsTable.$inferInsert
}

type OperatorSelect = {
  users: typeof sqliteUsersTable.$inferSelect
  collaborators: typeof sqliteCollaboratorsTable.$inferSelect
  operators: typeof sqliteOperatorsTable.$inferSelect
}

export class SqliteOperatorRepository implements IUsersRepository<Operator> {
  async add(user: Operator): Promise<void> {
    const { users, collaborators, operators } =
      await this.mapToOperatorInsert(user)

    const userResult = await sqlite.insert(sqliteUsersTable).values(users)

    if (!userResult.rowsAffected) throw new Error('Algo salio mal')

    const collaboratorResult = await sqlite
      .insert(sqliteCollaboratorsTable)
      .values(collaborators)

    if (!collaboratorResult) throw new Error('Algo salio mal')

    const operatorResult = await sqlite
      .insert(sqliteOperatorsTable)
      .values(operators)

    if (!operatorResult.rowsAffected) throw new Error('Algo salio mal')
  }

  async edit(user: Operator): Promise<void> {
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
      operators: { operatorTypeId },
    } = await this.mapToOperatorInsert(user)

    const userResult = await sqlite
      .update(sqliteUsersTable)
      .set({
        handle,
        firstName,
        lastName,
        email,
        state,
        roleId,
        updatedAt,
      })
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

    if (!collaboratorResult) throw new Error('Algo salio mal')

    const operatorResult = await sqlite
      .update(sqliteOperatorsTable)
      .set({ operatorTypeId })
      .where(eq(sqliteOperatorsTable.userId, id))

    if (!operatorResult.rowsAffected) throw new Error('Algo salio mal')
  }

  async remove(id: string): Promise<void> {
    const operatorResult = await sqlite
      .delete(sqliteOperatorsTable)
      .where(eq(sqliteOperatorsTable.userId, id))

    if (!operatorResult.rowsAffected) throw new Error('Algo salio mal')

    const collaboratorResult = await sqlite
      .delete(sqliteCollaboratorsTable)
      .where(eq(sqliteCollaboratorsTable.userId, id))

    if (!collaboratorResult) throw new Error('Algo salio mal')

    const userResult = await sqlite
      .delete(sqliteUsersTable)
      .where(eq(sqliteUsersTable.id, id))

    if (!userResult.rowsAffected) throw new Error('Algo salio mal')
  }

  async findAll(): Promise<Operator[]> {
    const operators = await sqlite
      .select()
      .from(sqliteUsersTable)
      .innerJoin(
        sqliteCollaboratorsTable,
        eq(sqliteUsersTable.id, sqliteCollaboratorsTable.userId)
      )
      .innerJoin(
        sqliteOperatorsTable,
        eq(sqliteUsersTable.id, sqliteOperatorsTable.userId)
      )

    return !operators.length
      ? []
      : await Promise.all(
          operators.map(async (operator) => await this.mapToOperator(operator))
        )
  }

  async findOne(id: string): Promise<Operator | null> {
    const [operator] = await sqlite
      .select()
      .from(sqliteUsersTable)
      .innerJoin(
        sqliteCollaboratorsTable,
        eq(sqliteUsersTable.id, sqliteCollaboratorsTable.userId)
      )
      .innerJoin(
        sqliteOperatorsTable,
        eq(sqliteUsersTable.id, sqliteOperatorsTable.userId)
      )
      .where(eq(sqliteUsersTable.id, id))

    return !operator ? null : await this.mapToOperator(operator)
  }

  private async mapToOperatorInsert(
    operator: Operator
  ): Promise<OperatorInsert> {
    return {
      users: {
        id: operator.id,
        handle: operator.handle,
        firstName: operator.firstName,
        lastName: operator.lastName,
        email: operator.email,
        password: await hash(
          operator.password,
          await genSalt(Number(SALT_ROUNDS))
        ),
        roleId: operator.roleId,
        state: operator.state,
        createdAt: operator.createdAt.toJSON(),
        updatedAt: operator.updatedAt.toJSON(),
        deletedAt: operator.deletedAt?.toJSON() || null,
      },
      collaborators: {
        userId: operator.id,
        salary: operator.salary,
        yearsExperience: operator.yearsExperience,
        hierarcyId: operator.hierarchyId,
        businessAreaId: operator.businessAreaId,
        educationDegreeId: operator.educationDegreeId,
        contractTypeId: operator.contractTypeId,
      },
      operators: {
        userId: operator.id,
        operatorTypeId: operator.operatorTypeId,
      },
    }
  }

  private async mapToOperator(operator: OperatorSelect): Promise<Operator> {
    return new Operator(
      operator.users.id,
      operator.users.handle,
      operator.users.firstName,
      operator.users.lastName,
      operator.users.email,
      operator.users.password,
      operator.collaborators.salary,
      operator.collaborators.yearsExperience,
      operator.collaborators.hierarcyId,
      operator.collaborators.businessAreaId,
      operator.collaborators.educationDegreeId,
      operator.collaborators.contractTypeId,
      operator.operators.operatorTypeId,
      operator.users.state,
      operator.users.roleId,
      getTemporalFrom(operator.users.createdAt),
      getTemporalFrom(operator.users.updatedAt),
      !operator.users.deletedAt
        ? null
        : getTemporalFrom(operator.users.deletedAt)
    )
  }
}
