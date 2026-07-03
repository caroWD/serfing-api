import * as z from 'zod'
import { collaboratorSelectSchema } from './collaborator-schema.js'
import { passwordSchema } from './user-schema.js'

export const operatorSelectSchema = collaboratorSelectSchema.extend({
  operatorTypeId: z.uuidv7(),
})

export type OperatorSelect = z.infer<typeof operatorSelectSchema>

export const operatorInsertSchema = operatorSelectSchema
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

export type OperatorInsert = z.infer<typeof operatorInsertSchema>

export const addOperatorRequestSchema = operatorInsertSchema.omit({
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
})

export type AddOperatorRequest = z.infer<typeof addOperatorRequestSchema>

export const editOperatorRequestSchema = addOperatorRequestSchema.omit({
  password: true,
})

export type EditOperatorRequest = z.infer<typeof editOperatorRequestSchema>
