import { eq } from 'drizzle-orm'
import { sqliteAccountantPositionsTable } from '../db/schemas/index.js'
import type { IBaseRepository } from '../interfaces/index.js'
import { AccountantPosition } from '../models/index.js'
import { sqlite } from './databases.js'

export class SqliteAccountantPositionRepository implements IBaseRepository<AccountantPosition> {
  async add(entity: AccountantPosition): Promise<void> {
    const accountantPosition = await this.mapToAccountantPositionInsert(entity)

    const { rowsAffected } = await sqlite
      .insert(sqliteAccountantPositionsTable)
      .values(accountantPosition)

    if (!rowsAffected) throw new Error('Algo salio mal')
  }

  async edit(entity: AccountantPosition): Promise<void> {
    const accountantPosition = await this.mapToAccountantPositionInsert(entity)

    const { rowsAffected } = await sqlite
      .update(sqliteAccountantPositionsTable)
      .set({
        name: accountantPosition.name,
        description: accountantPosition.description,
      })
      .where(eq(sqliteAccountantPositionsTable.id, accountantPosition.id))

    if (!rowsAffected) throw new Error('Algo salio mal')
  }

  async remove(id: string): Promise<void> {
    const { rowsAffected } = await sqlite
      .delete(sqliteAccountantPositionsTable)
      .where(eq(sqliteAccountantPositionsTable.id, id))

    if (!rowsAffected) throw new Error('Algo salio mal')
  }

  async findAll(): Promise<AccountantPosition[]> {
    const accountantPositions = await sqlite
      .select()
      .from(sqliteAccountantPositionsTable)

    return !accountantPositions.length
      ? []
      : Promise.all(
          accountantPositions.map(
            async (accountantPosition) =>
              await this.mapToAccountantPosition(accountantPosition)
          )
        )
  }

  async findOne(id: string): Promise<AccountantPosition | null> {
    const [accountantPosition] = await sqlite
      .select()
      .from(sqliteAccountantPositionsTable)
      .where(eq(sqliteAccountantPositionsTable.id, id))

    return !accountantPosition
      ? null
      : await this.mapToAccountantPosition(accountantPosition)
  }

  async ensureAlreadyExists(name: string): Promise<boolean> {
    const [exists] = await sqlite
      .select({ name: sqliteAccountantPositionsTable.name })
      .from(sqliteAccountantPositionsTable)
      .where(eq(sqliteAccountantPositionsTable.name, name))

    return !exists ? false : true
  }

  private async mapToAccountantPositionInsert(
    accountantPosition: AccountantPosition
  ): Promise<typeof sqliteAccountantPositionsTable.$inferInsert> {
    return {
      id: accountantPosition.id,
      name: accountantPosition.name,
      description: accountantPosition.description,
    }
  }

  private async mapToAccountantPosition(
    accountantPosition: typeof sqliteAccountantPositionsTable.$inferSelect
  ): Promise<AccountantPosition> {
    return new AccountantPosition(
      accountantPosition.id,
      accountantPosition.name,
      accountantPosition.description
    )
  }
}
