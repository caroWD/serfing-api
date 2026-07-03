import * as z from 'zod'

const passwordSchema = z
  .string({ error: 'La contraseña debe ser una cadena de caracteres' })
  .refine((val) => !/\s+/g.test(val), {
    error: 'La contraseña no puede contener espacios',
  })
  .regex(/^(?=.*[a-z]).+$/, {
    error: 'La contraseña debe contener al menos una letra minúscula',
  })
  .regex(/^(?=.*[A-Z]).+$/, {
    error: 'La contraseña debe contener al menos una letra mayúscula',
  })
  .regex(/^(?=.*[0-9]).+$/, {
    error: 'La contraseña debe contener al menos un número',
  })
  .regex(/^(?=.*\d)(?=.*[$@$!%*?&/])([A-Za-z\d$@$!%*?&/]|[^ ]).+$/, {
    error:
      'La contraseña debe contener al menos uno de los siguientes caracteres especiales: «$@$!%*?&/»',
  })

export const userSelectSchema = z.object({
  id: z.uuidv7(),
  handle: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.email(),
  password: passwordSchema,
  state: z.enum(['pending', 'enabled', 'disabled']),
  roleId: z.uuidv7(),
  createdAt: z.iso.date(),
  updatedAt: z.iso.date(),
  deletedAt: z.iso.date().nullable(),
})

export const userInsertSchema = userSelectSchema
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

export const addUserRequestSchema = userInsertSchema.omit({
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
})

export type AddUserRequest = z.infer<typeof addUserRequestSchema>

export const editUserRequestSchema = addUserRequestSchema.omit({
  password: true,
})

export type EditUserRequest = z.infer<typeof editUserRequestSchema>

export const changePasswordRequestSchema = z.object({
  id: z.uuidv7(),
  current: passwordSchema.regex(/^.{8,20}$/, {
    error:
      'La contraseña debe tener una longitud mínima de 8 caracteres y máxima de 20 caracteres',
  }),
  next: passwordSchema.regex(/^.{8,20}$/, {
    error:
      'La contraseña debe tener una longitud mínima de 8 caracteres y máxima de 20 caracteres',
  }),
})

export type ChangePasswordRequest = z.infer<typeof changePasswordRequestSchema>

export const authUserRequestSchema = userInsertSchema.pick({
  handle: true,
  password: true,
})

export type AuthUserRequest = z.infer<typeof authUserRequestSchema>

export type AuthResponse = {
  message: string
  state: boolean
  token: string | null
}

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
