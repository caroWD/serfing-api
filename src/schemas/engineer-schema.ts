import * as z from 'zod'
import { collaboratorSelectSchema } from './collaborator-schema.js'
import { passwordSchema } from './user-schema.js'

export const engineerSelectSchema = collaboratorSelectSchema.extend({
  engineerPositionId: z.uuidv7(),
})

export type EngineerSelect = z.infer<typeof engineerSelectSchema>

export const engineerInsertSchema = engineerSelectSchema
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

export type EngineerInser = z.infer<typeof engineerInsertSchema>

export const addEngineerRequestSchema = engineerInsertSchema.omit({
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
})

export type AddEngineerRequest = z.infer<typeof addEngineerRequestSchema>

export const editEngineerRequestSchema = addEngineerRequestSchema.omit({
  password: true,
})

export type EditEngineerRequest = z.infer<typeof editEngineerRequestSchema>
