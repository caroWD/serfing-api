import * as z from 'zod'
import { collaboratorSelectSchema } from './collaborator-schema.js'
import { passwordSchema } from './user-schema.js'

export const sellerSelectSchema = collaboratorSelectSchema.extend({
  commissionRate: z.number().min(0.3),
  saleTypeId: z.uuidv7(),
})

export type SellerSelect = z.infer<typeof sellerSelectSchema>

export const sellerInsertSchema = sellerSelectSchema
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

export type SellerInsert = z.infer<typeof sellerInsertSchema>

export const addSellerRequestSchema = sellerInsertSchema.omit({
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
})

export type AddSellerRequest = z.infer<typeof addSellerRequestSchema>

export const editSellerRequestSchema = addSellerRequestSchema.omit({
  password: true,
})

export type EditSellerRequest = z.infer<typeof editSellerRequestSchema>
