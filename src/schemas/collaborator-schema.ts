import * as z from 'zod'
import { passwordSchema, userSelectSchema } from './user-schema.js'

export const collaboratorSelectSchema = userSelectSchema.extend({
  salary: z.number().min(1750905),
  yearsExperience: z.number().min(0.5),
  hierarcyId: z.uuidv7(),
  businessAreaId: z.uuidv7(),
  educationDegreeId: z.uuidv7(),
  contractTypeId: z.uuidv7(),
})

export type CollaboratorSelect = z.infer<typeof collaboratorSelectSchema>

export const collaboratorInsertSchema = collaboratorSelectSchema
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

export const addCollaboratorRequestSchema = collaboratorInsertSchema.omit({
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
})

export type AddCollaboratorRequest = z.infer<
  typeof addCollaboratorRequestSchema
>

export const editCollaboratorRequestSchema = addCollaboratorRequestSchema.omit({
  password: true,
})

export type EditCollaboratorRequest = z.infer<
  typeof editCollaboratorRequestSchema
>
