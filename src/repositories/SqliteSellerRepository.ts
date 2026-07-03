import { genSalt, hash } from 'bcryptjs'
import {
  sqliteCollaboratorsTable,
  sqliteSellersTable,
  sqliteUsersTable,
} from '../db/schemas/index.js'
import { Seller } from '../models/index.js'
import { SALT_ROUNDS } from '../config/index.js'
import { getTemporalFrom } from '../helpers/index.js'
import { sqlite } from './databases.js'
import { eq } from 'drizzle-orm'
import type { IUsersRepository } from '../interfaces/index.js'

export type SellerInsert = {
  users: typeof sqliteUsersTable.$inferInsert
  collaborators: typeof sqliteCollaboratorsTable.$inferInsert
  sellers: typeof sqliteSellersTable.$inferInsert
}

export type SellerSelect = {
  users: typeof sqliteUsersTable.$inferSelect
  collaborators: typeof sqliteCollaboratorsTable.$inferSelect
  sellers: typeof sqliteSellersTable.$inferSelect
}

export class SqliteSellerRepository implements IUsersRepository<Seller> {
  async add(user: Seller): Promise<void> {
    const { users, collaborators, sellers } = await this.mapToSellerInsert(user)

    const userResult = await sqlite.insert(sqliteUsersTable).values(users)

    if (!userResult.rowsAffected) throw new Error('Algo salio mal')

    const collaboratorResult = await sqlite
      .insert(sqliteCollaboratorsTable)
      .values(collaborators)

    if (!collaboratorResult.rowsAffected) throw new Error('Algo salio mal')

    const sellerResult = await sqlite.insert(sqliteSellersTable).values(sellers)

    if (!sellerResult.rowsAffected) throw new Error('Algo salio mal')
  }

  async edit(user: Seller): Promise<void> {
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
        hierarcyId,
        businessAreaId,
        educationDegreeId,
        contractTypeId,
        salary,
        yearsExperience,
      },
      sellers: { saleTypeId, commissionRate },
    } = await this.mapToSellerInsert(user)

    const userResult = await sqlite
      .update(sqliteUsersTable)
      .set({ handle, firstName, lastName, email, state, roleId, updatedAt })
      .where(eq(sqliteUsersTable.id, id))

    if (!userResult.rowsAffected) throw new Error('Algo salio mal')

    const collaboratorResult = await sqlite
      .update(sqliteCollaboratorsTable)
      .set({
        hierarcyId,
        businessAreaId,
        educationDegreeId,
        contractTypeId,
        salary,
        yearsExperience,
      })
      .where(eq(sqliteCollaboratorsTable.userId, id))

    if (!collaboratorResult.rowsAffected) throw new Error('Algo salio mal')

    const sellerResult = await sqlite
      .update(sqliteSellersTable)
      .set({ saleTypeId, commissionRate })
      .where(eq(sqliteSellersTable.userId, id))

    if (!sellerResult.rowsAffected) throw new Error('Algo salio mal')
  }

  async remove(id: string): Promise<void> {
    const sellerResult = await sqlite
      .delete(sqliteSellersTable)
      .where(eq(sqliteSellersTable.userId, id))

    if (!sellerResult.rowsAffected) throw new Error('Algo salio mal')

    const collaboratorResult = await sqlite
      .delete(sqliteCollaboratorsTable)
      .where(eq(sqliteCollaboratorsTable.userId, id))

    if (!collaboratorResult.rowsAffected) throw new Error('Algo salio mal')

    const { rowsAffected } = await sqlite
      .delete(sqliteUsersTable)
      .where(eq(sqliteUsersTable.id, id))

    if (!rowsAffected) throw new Error('Algo salio mal')
  }

  async findAll(): Promise<Seller[]> {
    const sellers = await sqlite
      .select()
      .from(sqliteSellersTable)
      .innerJoin(
        sqliteCollaboratorsTable,
        eq(sqliteSellersTable.userId, sqliteCollaboratorsTable.userId)
      )
      .innerJoin(
        sqliteUsersTable,
        eq(sqliteCollaboratorsTable.userId, sqliteUsersTable.id)
      )

    return !sellers.length
      ? []
      : await Promise.all(
          sellers.map(async (seller) => await this.mapToSeller(seller))
        )
  }

  async findOne(id: string): Promise<Seller | null> {
    const [seller] = await sqlite
      .select()
      .from(sqliteSellersTable)
      .innerJoin(
        sqliteCollaboratorsTable,
        eq(sqliteSellersTable.userId, sqliteCollaboratorsTable.userId)
      )
      .innerJoin(
        sqliteUsersTable,
        eq(sqliteCollaboratorsTable.userId, sqliteUsersTable.id)
      )
      .where(eq(sqliteSellersTable.userId, id))

    return !seller ? null : await this.mapToSeller(seller)
  }

  private async mapToSellerInsert(user: Seller): Promise<SellerInsert> {
    return {
      users: {
        id: user.id,
        handle: user.handle,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        password: await hash(user.password, await genSalt(Number(SALT_ROUNDS))),
        state: user.state,
        roleId: user.roleId,
        createdAt: user.createdAt.toJSON(),
        updatedAt: user.updatedAt.toJSON(),
        deletedAt: user.deletedAt?.toJSON() || null,
      },
      collaborators: {
        userId: user.id,
        salary: user.salary,
        yearsExperience: user.yearsExperience,
        hierarcyId: user.hierarchyId,
        businessAreaId: user.businessAreaId,
        educationDegreeId: user.educationDegreeId,
        contractTypeId: user.contractTypeId,
      },
      sellers: {
        userId: user.id,
        commissionRate: user.commissionRate,
        saleTypeId: user.saleTypeId,
      },
    }
  }

  private async mapToSeller(user: SellerSelect): Promise<Seller> {
    return new Seller(
      user.users.id,
      user.users.handle,
      user.users.firstName,
      user.users.lastName,
      user.users.email,
      user.users.password,
      user.collaborators.salary,
      user.collaborators.yearsExperience,
      user.collaborators.hierarcyId,
      user.collaborators.businessAreaId,
      user.collaborators.educationDegreeId,
      user.collaborators.contractTypeId,
      user.sellers.commissionRate,
      user.sellers.saleTypeId,
      user.users.state,
      user.users.roleId,
      getTemporalFrom(user.users.createdAt),
      getTemporalFrom(user.users.updatedAt),
      !user.users.deletedAt ? null : getTemporalFrom(user.users.deletedAt)
    )
  }
}
