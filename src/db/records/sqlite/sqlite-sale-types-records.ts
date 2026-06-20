import type { sqliteSaleTypesTable } from '../../schemas/index.js'

export const sqliteSaleTypesRecords: (typeof sqliteSaleTypesTable.$inferInsert)[] =
  [
    {
      id: '019ee2ab-5f2d-743f-85e0-a186a640483e',
      name: 'Proyectos Llave en Mano',
      description:
        'Es la venta estrella de las empresas integradas. Se le vende al cliente una solución absoluta: la empresa se encarga desde el diseño inicial (Ingeniería), la compra de todos los equipos (Suministros) hasta la construcción y puesta en marcha (Construcción).',
    },
    {
      id: '019ee2ab-7602-7e5b-be15-bb15df9163f2',
      name: 'Servicios de Consultoría e Ingeniería Pura',
      description:
        'Se vende únicamente el "cerebro". Involucra estudios de factibilidad, diseños conceptuales, ingeniería de detalle, modelado BIM o interventorías (supervisión técnica de obras construidas por terceros).',
    },
    {
      id: '019ee2ab-88a7-70b3-8ea7-d8cf799405d8',
      name: 'Operación y Mantenimiento',
      description:
        'Una vez ejecutada y entregada la obra, se le vende al cliente el contrato para operar o mantener la infraestructura (mantenimiento preventivo de subestaciones, plantas de proceso, sistemas HVAC, etc.).',
    },
    {
      id: '019ee2ab-a021-720e-926b-4e31125802aa',
      name: 'B2B (Business to Business)',
      description:
        'Venta directa a otras empresas del sector privado (mineras, constructoras de retail, plantas de manufactura, desarrolladores de energía). Se basa en la reputación, la capacidad técnica demostrada y la negociación directa de presupuestos.',
    },
    {
      id: '019ee2ab-b293-79ed-a620-bad7f68e7c61',
      name: 'B2G (Business to Government)',
      description:
        'Venta de infraestructura, vías, redes eléctricas o consultorías a entidades del Estado (ministerios, alcaldías, empresas públicas).',
    },
    {
      id: '019ee2ab-c730-7d97-8fdd-4bf25c9713eb',
      name: 'Licitación (Abierta o Cerrada)',
      description:
        'El cliente publica los términos de referencia (un problema que necesita resolver) y convoca a varias ingenierías a competir. El área de ventas lidera la estructuración de la oferta económica y técnica, coordinando con los ingenieros de diseño para costear materiales y horas de ingeniería.',
    },
    {
      id: '019ee2ab-db09-7982-9f28-db94c0495d4d',
      name: 'Oferta No Solicitada y Proyectos de Iniciativa Privada',
      description:
        'El equipo comercial identifica una necesidad u oportunidad antes de que el cliente la publique. La empresa diseña una solución preliminar por su cuenta, la presenta al cliente (público o privado) demostrando cómo les ahorrará dinero o mejorará su eficiencia, y busca una adjudicación directa o una APP (Alianza Público-Privada).',
    },
  ]
