import type { sqliteBusinessAreasTable } from '../../schemas/index.js'

export const sqliteBusinessAreasRecords: (typeof sqliteBusinessAreasTable.$inferInsert)[] =
  [
    {
      id: '019ee29c-be97-7e52-a59f-004f4baad8b2',
      name: 'Área de Ingeniería y Diseño',
      description:
        'Es el "cerebro" de la empresa. Su objetivo es transformar los requerimientos del cliente en planos, simulaciones y especificaciones técnicas precisas y seguras.',
    },
    {
      id: '019ee29c-d13e-74be-8888-c0f3b010a935',
      name: 'Área de Operaciones y Ejecución de Campos',
      description:
        'Es el "músculo" de la compañía. Su misión es tomar la ingeniería aprobada y levantarla en el mundo real, coordinando la mano de obra, la maquinaria y los métodos constructivos.',
    },
    {
      id: '019ee29d-31be-7e99-b3e6-f48ad62d2a84',
      name: 'Área de Gestión y Control de Proyectos',
      description:
        'Actúa como el árbitro y el motor financiero de los proyectos. No diseña ni construye directamente, sino que monitorea que las áreas de Diseño y Ejecución cumplan con lo pactado.',
    },
    {
      id: '019ee29d-4924-7946-84fd-630937c0d6cc',
      name: 'Área de Gestión de Calidad y Aseguramiento',
      description:
        'Es un área con total autonomía, indispensable para garantizar que lo que se construye coincida exactamente con las normas técnicas y el diseño aprobado.',
    },
    {
      id: '019ee29d-5e2d-7f07-84be-cbf6d17453ba',
      name: 'Área de Seguridad, Salud Ocupacional y Medio Ambiente',
      description:
        'Un área crítica en empresas con ejecución en campo. Su prioridad absoluta es la prevención de riesgos y el cuidado del entorno.',
    },
    {
      id: '019ee29d-71a3-7d20-b5c6-321b2b0f3722',
      name: 'Área de Cadena de Suministro y Compras',
      description: 'El puente de abastecimiento entre la oficina y la obra.',
    },
    {
      id: '019ee29d-8191-712c-85d5-316ece6745c7',
      name: 'Área Comercial y Licitaciones',
      description:
        'Encargada de buscar nuevos horizontes y asegurar el flujo de trabajo de la empresa.',
    },
  ]
