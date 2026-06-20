import type { sqliteContractTypesTable } from '../../schemas/index.js'

export const sqliteContractTypesRecords: (typeof sqliteContractTypesTable.$inferInsert)[] =
  [
    {
      id: '019ee2a3-aac3-7382-b3fc-ae2fcf4b47c6',
      name: 'Término Indefinido',
      description:
        'Este personal permanece en la empresa independientemente de si hay un proyecto activo en el momento, dedicándose al desarrollo de metodologías, licitaciones o estandarización de procesos.',
    },
    {
      id: '019ee2a3-bd14-789f-aacd-68de7516bfed',
      name: 'Obra o Labor',
      description:
        'La duración del contrato está ligada estrictamente a la duración del proyecto de ingeniería. Al finalizar la obra o la fase específica, el contrato termina legalmente sin lugar a indemnizaciones por despido, lo que protege el flujo de caja de la empresa.',
    },
    {
      id: '019ee2a3-d46d-738b-9410-70f5319a939a',
      name: 'Prestación de Servicios Profesionales',
      description:
        'Permite contar con mentes brillantes y altamente especializadas para tareas puntuales dentro del diseño, sin incurrir en los costos prestacionales de una contratación directa a tiempo completo.',
    },
    {
      id: '019ee2a3-e90f-74d6-b6d2-12f294f9fca8',
      name: 'Tercerización Operativa',
      description:
        'En lugar de contratar directamente a 200 obreros o soldadores, la empresa contrata a una firma subcontratista especializada en esa labor. Esto traslada el riesgo laboral y operativo al subcontratista, permitiendo a la compañía de ingeniería enfocarse puramente en la supervisión y gerencia.',
    },
  ]
