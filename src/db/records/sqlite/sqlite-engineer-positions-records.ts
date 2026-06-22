import type { sqliteEngineerPositionsTable } from '../../schemas/index.js'

export const sqliteEngineerPositionsRecords: (typeof sqliteEngineerPositionsTable.$inferInsert)[] =
  [
    {
      id: '019ee2b1-afdc-7a64-9d10-18fc56e939d8',
      name: 'Ingeniero de Diseño Senior',
      description:
        'Liderar conceptualmente los proyectos de su especialidad. Realiza los cálculos estructurales complejos, simulaciones de fluidos o diseños de sistemas eléctricos mayores. Revisa y sella los entregables antes de ir a producción.',
    },
    {
      id: '019ee2b1-c5ca-7c07-a106-b60d857ee612',
      name: 'Ingeniero de Diseño Junior / Semi-Senior',
      description:
        'Desarrollar el trabajo técnico de soporte: modelado matemático, dimensionamiento de componentes menores (ej. vigas secundarias, bandejas portacables), elaboración de hojas de datos de equipos y memorias de cálculo estándar.',
    },
    {
      id: '019ee2b1-d6f0-7634-a1fb-218fd83778a2',
      name: 'Ingeniero Coordinador BIM',
      description:
        'Es un ingeniero (generalmente civil o mecánico) experto en entornos digitales. Se encarga de integrar los modelos 3D de todas las disciplinas para detectar "choques" o interferencias (ej. que una tubería pase por donde va una viga) antes de que el plano llegue a la obra, ahorrando millones en reprocesos.',
    },
    {
      id: '019ee2b1-e903-7c85-a40e-2ce983a02235',
      name: 'Ingeniero Residente de Obra / Ingeniero de Campo Senior',
      description:
        'Máxima autoridad de ingeniería en el sitio de construcción. Coordina las cuadrillas de trabajo, programa el uso de maquinaria, supervisa la logística de materiales y toma decisiones técnicas inmediatas cuando las condiciones del terreno varían frente al plano original.',
    },
    {
      id: '019ee2b1-fe1a-7dc3-8d34-1d31bb59a7ce',
      name: 'Ingeniero de Campo Junior',
      description:
        'Apoyar al residente en el control diario de la obra. Toma la medición de los avances físicos (metros cúbicos de concreto vaciados, toneladas de acero figuradas), genera los reportes diarios de obra y coordina los pedidos de materiales al almacén.',
    },
    {
      id: '019ee2b2-1128-725a-8921-b650f3b72b1f',
      name: 'Ingeniero de Control de Proyectos',
      description:
        'Monitorear la línea base del proyecto. Analiza desvíos en el presupuesto y el cronograma, calcula el valor ganado ($EVM$) y genera proyecciones financieras para que el Gerente de Proyecto tome decisiones antes de que un desfase sea crítico.',
    },
    {
      id: '019ee2b2-4a09-777c-9443-0a0746bc06c2',
      name: 'Ingeniero de Estimaciones y Costos',
      description:
        'Trabaja muy de la mano con el área de ventas. Se encarga de calcular cuántas horas de ingeniería, cuántos materiales y cuánta maquinaria se requerirá para un proyecto nuevo, estructurando el presupuesto maestro para las licitaciones.',
    },
    {
      id: '019ee2b2-5da0-70ca-956f-6521412e09aa',
      name: 'Ingeniero de Calidad',
      description:
        'Diseñar e implementar el Plan de Control de Calidad del proyecto. Supervisa los ensayos de laboratorio (resistencia de concreto, pruebas hidrostáticas, radiografías de soldadura) y asegura que cada fase constructiva cuente con la firma de liberación técnica antes de avanzar a la siguiente.',
    },
    {
      id: '019ee2b2-7287-7771-8183-3d6ddf944502',
      name: 'Ingeniero de Seguridad, Salud y Medio Ambiente',
      description:
        'Gestionar el riesgo humano y ambiental. Diseña los análisis de trabajo seguro (ATS), valida los permisos para tareas de alto riesgo (alturas, espacios confinados, trabajos en caliente) y asegura que la operación cumpla con las licencias ambientales en el sitio de la obra.',
    },
  ]
