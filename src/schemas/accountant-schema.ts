import * as z from 'zod'
import { collaboratorSelectSchema } from './collaborator-schema.js'
import { passwordSchema } from './user-schema.js'

export const accountantSelectSchema = collaboratorSelectSchema.extend({
  accountantPositionId: z.uuidv7(),
})

export type AccountantSelect = z.infer<typeof accountantSelectSchema>

export const accountantInsertSchema = accountantSelectSchema
  .omit({ password: true })
  .partial({
    state: true,
    createdAt: true,
    updatedAt: true,
    deletedAt: true,
  })
  .extend({
    password: passwordSchema.regex(/^.{8,20}$/, {
      error:
        'La contraseña debe tener una longitud mínima de 8 caracteres y máxima de 20 caracteres',
    }),
  })

export type AccountantInsert = z.infer<typeof accountantInsertSchema>

export const addAccountantRequestSchema = accountantInsertSchema.omit({
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
})

export type AddAccountantRequest = z.infer<typeof addAccountantRequestSchema>

export const editAccountantRequestSchema = addAccountantRequestSchema.omit({
  password: true,
})

export type EditAccountantRequest = z.infer<typeof editAccountantRequestSchema>
