import * as z from 'zod'

export const baseSchema = z.object({
  id: z.uuidv7(),
  name: z.string().min(5).max(100),
  description: z.string().min(10).max(255),
})

export type BaseRequest = z.infer<typeof baseSchema>

export const idSchema = baseSchema.pick({ id: true })

export type IdRequest = z.infer<typeof idSchema>
