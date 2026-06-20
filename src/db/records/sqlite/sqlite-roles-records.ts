import type { sqliteRolesTable } from '../../schemas/index.js'

export const sqliteRolesRecords: (typeof sqliteRolesTable.$inferInsert)[] = [
  {
    id: '019ee26e-ca6e-7de8-b2db-30bd99436fa7',
    name: 'system:admin',
    description:
      'Acceso total al sistema, gestión de configuraciones globales, auditoría y control de todos los roles y permisos.',
  },
  {
    id: '019ee26f-06f5-7913-9207-058fe66142f5',
    name: 'system:support',
    description:
      'Acceso limitado para visualizar perfiles de usuario y equipos con el fin de resolver incidencias reportadas por los usuarios.',
  },
  {
    id: '019ee26f-1ae5-76c1-b25d-e197ab695b79',
    name: 'user:premium',
    description:
      'Usuario con acceso a todas las funcionalidades estándar, además de reportes avanzados, comparativas históricas ilimitadas y mayor capacidad de creación de equipos.',
  },
  {
    id: '019ee26f-328d-71ed-b1f2-9260d491d22d',
    name: 'user:standard',
    description:
      'Rol básico por defecto. Permite crear equipos, listas de compras y participar en tableros con límites definidos por la plataforma.',
  },
  {
    id: '019ee26f-467d-7b0f-8f82-112606765a06',
    name: 'user:guest',
    description:
      'Rol con acceso restringido, generalmente para usuarios que solo visualizan listas compartidas públicamente o que están en periodo de prueba.',
  },
]
