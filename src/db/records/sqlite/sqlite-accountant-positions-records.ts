import type { sqliteAccountantPositionsTable } from '../../schemas/index.js'

export const sqliteAccountantPositionsRecords: (typeof sqliteAccountantPositionsTable.$inferInsert)[] =
  [
    {
      id: '019ee2b8-790e-7cda-999b-fe9ab885c930',
      name: 'Contador General / Director de Contabilidad',
      description:
        'Garantizar la razonabilidad de los estados financieros de la empresa bajo normas internacionales (NIIF/IFRS). Coordina los cierres contables mensuales, firma los balances, atiende auditorías externas y asegura el cumplimiento estricto de las obligaciones fiscales ante la entidad de impuestos (como la DIAN en Colombia).',
    },
    {
      id: '019ee2b8-91c4-7a1d-91cc-8d327e9fa142',
      name: 'Especialista / Analista de Impuestos',
      description:
        'Diseñar la estrategia fiscal de la compañía y liquidar los impuestos nacionales y locales (IVA, Retención en la Fuente, Renta, ICA).',
    },
    {
      id: '019ee2b8-a2be-7c40-a69a-12867829fa28',
      name: 'Analista de Contabilidad de Costos y Presupuestos',
      description:
        'Es el puente directo entre contabilidad e ingeniería. Se encarga de asignar cada gasto, factura de proveedor o nómina al código de proyecto correspondiente (Centro de Costos).',
    },
    {
      id: '019ee2b8-b19d-7474-811d-d50925ced564',
      name: 'Analista de Cuentas por Pagar',
      description:
        'Gestionar la recepción, validación y registro de facturas de proveedores de materiales (cemento, acero) y subcontratistas.',
    },
    {
      id: '019ee2b8-c3a6-742f-a853-1415bf109374',
      name: 'Analista de Nómina y Seguridad Social',
      description:
        'Liquidar los salarios, horas extras, prestaciones sociales y aportes a seguridad social de todo el personal.',
    },
    {
      id: '019ee2b8-d54c-71e6-8fe9-6759f7f048d7',
      name: 'Auxiliar Contable / Tesorería',
      description:
        'Apoyar las tareas del día a día como la conciliación de extractos bancarios, legalización de cajas menores (muy comunes en los frentes de obra para gastos menores imprevistos) y el archivo digital de soportes contables.',
    },
  ]
