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

export type SellerInsert = Omit<
  typeof sqliteUsersTable.$inferInsert &
    typeof sqliteCollaboratorsTable.$inferInsert &
    typeof sqliteSellersTable.$inferInsert,
  'userId'
>

export type SellerSelect = Omit<
  typeof sqliteUsersTable.$inferSelect &
    typeof sqliteCollaboratorsTable.$inferSelect &
    typeof sqliteSellersTable.$inferSelect,
  'userId'
>

export class SqliteSellerRepository implements IUsersRepository<Seller> {
  async add(user: Seller): Promise<void> {
    const {
      id,
      handle,
      firstName,
      lastName,
      email,
      password,
      state,
      roleId,
      createdAt,
      updatedAt,
      deletedAt,
      hierarcyId,
      businessAreaId,
      educationDegreeId,
      contractTypeId,
      salary,
      yearsExperience,
      saleTypeId,
      commissionRate,
    } = await this.mapToSellerInsert(user)

    const userResult = await sqlite.insert(sqliteUsersTable).values({
      id,
      handle,
      firstName,
      lastName,
      email,
      password,
      state,
      roleId,
      createdAt,
      updatedAt,
      deletedAt,
    })

    if (!userResult.rowsAffected) throw new Error('Algo salio mal')

    const collaboratorResult = await sqlite
      .insert(sqliteCollaboratorsTable)
      .values({
        userId: id,
        hierarcyId,
        businessAreaId,
        educationDegreeId,
        contractTypeId,
        salary,
        yearsExperience,
      })

    if (!collaboratorResult.rowsAffected) throw new Error('Algo salio mal')

    const sellerResult = await sqlite.insert(sqliteSellersTable).values({
      userId: id,
      saleTypeId,
      commissionRate,
    })

    if (!sellerResult.rowsAffected) throw new Error('Algo salio mal')
  }

  async edit(user: Seller): Promise<void> {
    const {
      id,
      handle,
      firstName,
      lastName,
      email,
      state,
      roleId,
      updatedAt,
      hierarcyId,
      businessAreaId,
      educationDegreeId,
      contractTypeId,
      salary,
      yearsExperience,
      saleTypeId,
      commissionRate,
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
      .select({
        id: sqliteUsersTable.id,
        handle: sqliteUsersTable.handle,
        firstName: sqliteUsersTable.firstName,
        lastName: sqliteUsersTable.lastName,
        email: sqliteUsersTable.email,
        password: sqliteUsersTable.password,
        salary: sqliteCollaboratorsTable.salary,
        yearsExperience: sqliteCollaboratorsTable.yearsExperience,
        hierarcyId: sqliteCollaboratorsTable.hierarcyId,
        businessAreaId: sqliteCollaboratorsTable.businessAreaId,
        educationDegreeId: sqliteCollaboratorsTable.educationDegreeId,
        contractTypeId: sqliteCollaboratorsTable.contractTypeId,
        commissionRate: sqliteSellersTable.commissionRate,
        saleTypeId: sqliteSellersTable.saleTypeId,
        state: sqliteUsersTable.state,
        roleId: sqliteUsersTable.roleId,
        createdAt: sqliteUsersTable.createdAt,
        updatedAt: sqliteUsersTable.updatedAt,
        deletedAt: sqliteUsersTable.deletedAt,
      })
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
      .select({
        id: sqliteUsersTable.id,
        handle: sqliteUsersTable.handle,
        firstName: sqliteUsersTable.firstName,
        lastName: sqliteUsersTable.lastName,
        email: sqliteUsersTable.email,
        password: sqliteUsersTable.password,
        salary: sqliteCollaboratorsTable.salary,
        yearsExperience: sqliteCollaboratorsTable.yearsExperience,
        hierarcyId: sqliteCollaboratorsTable.hierarcyId,
        businessAreaId: sqliteCollaboratorsTable.businessAreaId,
        educationDegreeId: sqliteCollaboratorsTable.educationDegreeId,
        contractTypeId: sqliteCollaboratorsTable.contractTypeId,
        commissionRate: sqliteSellersTable.commissionRate,
        saleTypeId: sqliteSellersTable.saleTypeId,
        state: sqliteUsersTable.state,
        roleId: sqliteUsersTable.roleId,
        createdAt: sqliteUsersTable.createdAt,
        updatedAt: sqliteUsersTable.updatedAt,
        deletedAt: sqliteUsersTable.deletedAt,
      })
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
      id: user.id,
      handle: user.handle,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: await hash(user.password, await genSalt(Number(SALT_ROUNDS))),
      salary: user.salary,
      yearsExperience: user.yearsExperience,
      hierarcyId: user.hierarchyId,
      businessAreaId: user.businessAreaId,
      educationDegreeId: user.educationDegreeId,
      contractTypeId: user.contractTypeId,
      commissionRate: user.commissionRate,
      saleTypeId: user.saleTypeId,
      state: user.state,
      roleId: user.roleId,
      createdAt: user.createdAt.toJSON(),
      updatedAt: user.updatedAt.toJSON(),
      deletedAt: user.deletedAt?.toJSON() || null,
    }
  }

  private async mapToSeller(user: SellerSelect): Promise<Seller> {
    return new Seller(
      user.id,
      user.handle,
      user.firstName,
      user.lastName,
      user.email,
      user.password,
      user.salary,
      user.yearsExperience,
      user.hierarcyId,
      user.businessAreaId,
      user.educationDegreeId,
      user.contractTypeId,
      user.commissionRate,
      user.saleTypeId,
      user.state,
      user.roleId,
      getTemporalFrom(user.createdAt),
      getTemporalFrom(user.updatedAt),
      !user.deletedAt ? null : getTemporalFrom(user.deletedAt)
    )
  }
}
