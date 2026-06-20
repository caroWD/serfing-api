import type { sqlitePermissionsTable } from '../../schemas/index.js'

export const sqlitePermissionsRecords: (typeof sqlitePermissionsTable.$inferInsert)[] =
  [
    {
      id: '019ee210-9cba-7bd0-bd9f-2d661bf25e8a',
      name: 'system:config:view',
      description:
        'Permite visualizar las configuraciones generales del sistema y logs de auditoría.',
    },
    {
      id: '019ee219-4485-79e7-9319-b31c376a12c8',
      name: 'system:config:manage',
      description:
        'Permite modificar variables de entorno, límites de la plataforma y mantenimiento técnico.',
    },
    {
      id: '019ee266-45a6-77c9-a063-b41d75df9ea0',
      name: 'system:reports:view',
      description:
        'Permite acceder a métricas de las tareas a nivel plataforma.',
    },
    {
      id: '019ee21a-dc74-7ede-9ea9-b34bcd5a0d1e',
      name: 'users:view',
      description:
        'Permite listar y ver perfiles de usuarios registrados en la plataforma.',
    },
    {
      id: '019ee21c-b0c1-76cf-812d-80acb64bab91',
      name: 'users:manage',
      description:
        'Permite suspender, reactivar o modificar roles globales de cualquier usuario.',
    },
    {
      id: '019ee266-5fd5-7383-9bd2-11bdac13e815',
      name: 'teams:view',
      description:
        'Permite visualizar los equipos en los que participa el usuario.',
    },
    {
      id: '019ee266-783c-7281-a432-015bdac3d756',
      name: 'teams:view:all',
      description:
        'Permite visualizar todos los equipos creados en la plataforma (fines de moderación).',
    },
  ]
