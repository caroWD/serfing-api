import * as z from 'zod'

export const baseSchema = z.object({
  id: z.uuidv7(),
  name: z.string().min(5).max(100),
  description: z.string().min(10).max(355),
})

export type BaseRequest = z.infer<typeof baseSchema>

export const idSchema = baseSchema.pick({ id: true })

export type IdRequest = z.infer<typeof idSchema>

export const rolePermissionSchema = z.object({
  roleId: z.uuidv7(),
  permissionId: z.uuidv7(),
})

export type RolePermissionRequest = z.infer<typeof rolePermissionSchema>
