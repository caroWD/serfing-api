import {
  SALT_ROUNDS,
  USER_ADMIN_PASSWORD,
  USER_SUPPORT_PASSWORD,
} from '../../../config/index.js'
import type { sqliteUsersTable } from '../../schemas/index.js'
import { hashSync, genSaltSync } from 'bcryptjs'

export const sqliteUsersRecords: (typeof sqliteUsersTable.$inferInsert)[] = [
  {
    id: '019ee2cc-9293-70a9-ad50-960908922bad',
    handle: '@carlos-admin',
    firstName: 'Carlos',
    lastName: 'Rodríguez',
    email: 'admin.carlos@serfing.com',
    password: hashSync(USER_ADMIN_PASSWORD, genSaltSync(Number(SALT_ROUNDS))),
    state: 'enabled',
    roleId: '019ee26e-ca6e-7de8-b2db-30bd99436fa7',
  },
  {
    id: '019ee2cc-a5c9-74bf-a5f9-dd707de4b83f',
    handle: '@sair-support',
    firstName: 'Sair',
    lastName: 'Bertel',
    email: 'support.sair@serfing.com',
    password: hashSync(USER_SUPPORT_PASSWORD, genSaltSync(Number(SALT_ROUNDS))),
    state: 'enabled',
    roleId: '019ee26f-06f5-7913-9207-058fe66142f5',
  },
]
