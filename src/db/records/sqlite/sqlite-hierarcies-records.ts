import type { sqliteHierarciesTable } from '../../schemas/index.js'

export const sqliteHierarciesRecords: (typeof sqliteHierarciesTable.$inferInsert)[] =
  [
    {
      id: '019ee28e-d1d2-77a1-a264-c70aee6d9418',
      name: 'Director General de Ingeniería y Operaciones',
      description:
        'Máxima autoridad operativa. Define la estrategia global de la empresa, aprueba los presupuestos de los grandes proyectos y asegura la alineación entre el equipo de diseño y el de construcción.',
    },
    {
      id: '019ee28e-e94b-7dc2-b717-d8675daf26e1',
      name: 'Director de Diseño e Ingeniería',
      description:
        'Responsable de la excelencia técnica en la fase de diseño. Supervisa todas las disciplinas de ingeniería (civil, mecánica, eléctrica, etc.) y asegura que los planos y especificaciones cumplan con las normativas internacionales y locales.',
    },
    {
      id: '019ee28e-fb48-79ac-9007-f1bf9561cc66',
      name: 'Director de Construcción y Ejecución',
      description:
        'Responsable de la fase en campo. Supervisa que la ejecución de las obras se realice en tiempo, forma, costo y con cero accidentes. Gestiona las relaciones con contratistas y subcontratistas mayores.',
    },
    {
      id: '019ee28f-0f28-7a40-94e4-7e4f597a7e20',
      name: 'Gerente de Proyecto',
      description:
        'El "dueño" del proyecto desde el día uno hasta la entrega final. Controla el "triángulo de hierro": alcance, tiempo y costo. Es el canal principal de comunicación con el cliente.',
    },
    {
      id: '019ee28f-20b4-79f6-a5d2-d80755dcd85d',
      name: 'Gerente de Ingeniería de Diseño',
      description:
        'Coordina a los líderes de cada disciplina técnica en la oficina. Su meta es entregar los paquetes de ingeniería (planos, memorias de cálculo) listos para ser construidos, evitando colisiones o errores de diseño.',
    },
    {
      id: '019ee28f-3720-7c5e-9369-36a52be1af09',
      name: 'Gerente de Construcción y Residente General',
      description:
        'Líder absoluto en el sitio de la obra. Coordina la logística, la maquinaria, la llegada de materiales y la fuerza laboral para que la ejecución no se detenga.',
    },
    {
      id: '019ee28f-4e45-7cee-8a9d-5b90409fcbad',
      name: 'Ingeniero Líder de Disciplina',
      description:
        'El referente técnico de su área en la oficina de diseño. Define los criterios de cálculo, revisa y sella los planos finales, y resuelve problemas técnicos complejos.',
    },
    {
      id: '019ee28f-6cf1-7fb1-81a5-90e755810fad',
      name: 'Supervisor de Obra y Jefe de Frente',
      description:
        'Encargado de un área específica en el campo (por ejemplo, supervisor de obra civil o supervisor de montaje electromecánico). Controla que las cuadrillas construyan siguiendo fielmente los planos de diseño.',
    },
    {
      id: '019ee28f-8782-77a1-8dcb-ce445245f95e',
      name: 'Coordinador de Control de Proyectos',
      description:
        'Especialista en costos y tiempos (Project Controls). Utiliza software como Primavera P6 o MS Project para medir el avance real frente al planificado y alertar sobre desviaciones.',
    },
    {
      id: '019ee28f-a516-7a0a-b14e-17f9715c3faf',
      name: 'Ingeniero de Diseño Senior',
      description:
        'Diseña sistemas complejos, realiza simulaciones y modelados avanzados, y toma decisiones técnicas de diseño con mínima supervisión.',
    },
    {
      id: '019ee28f-bd17-74c9-8149-63bc5a8f7429',
      name: 'Ingeniero de Diseño Junior y Semi-Senior',
      description:
        'Desarrolla cálculos matemáticos básicos, hojas de datos técnicos y da soporte en la creación de especificaciones de materiales.',
    },
    {
      id: '019ee28f-d0b8-7c22-a175-c8942fef46c9',
      name: 'Dibujante y Modelador BIM',
      description:
        'Traduce los conceptos de los ingenieros en modelos 3D y planos constructivos detallados utilizando software como Revit, AutoCAD o SolidWorks.',
    },
    {
      id: '019ee28f-e946-7b46-9708-3b0d8fbe213a',
      name: 'Ingeniero de Campo y Residente de Obra',
      description:
        'Profesional en el sitio que asiste al supervisor. Se encarga de la medición de avances diarios, resolución de dudas técnicas rápidas en campo y solicitudes de materiales.',
    },
    {
      id: '019ee28f-fca3-70c3-9145-18eac5ba3c2a',
      name: 'Ingeniero de Calidad y QA-QC',
      description:
        'Crucial para el éxito. Inspecciona que los materiales recibidos y el trabajo ejecutado cumplan con los estándares de calidad, realizando pruebas (de concreto, soldaduras, presión, etc.) y liberando los hitos de construcción.',
    },
    {
      id: '019ee290-138f-7690-89fe-4ac5d6e40e1e',
      name: 'Ingeniero de Seguridad, Salud y Medio Ambiente',
      description:
        'Asegura que se cumplan todas las normativas de seguridad industrial para prevenir accidentes en la obra y mitigar el impacto ambiental. Tiene el poder de detener la obra si detecta un riesgo inminente.',
    },
    {
      id: '019ee290-255c-7c2e-9575-6d5c244a2780',
      name: 'Comprador Técnico y Gestor de Suministros',
      description:
        'Negocia y adquiere los equipos mayores (turbinas, transformadores, estructuras) y materiales cotizados por el equipo de diseño para que lleguen a tiempo a la obra.',
    },
    {
      id: '019ee290-3761-76b1-a26d-cc0c7bd8045e',
      name: 'Planificador y Gestor de Cuentas',
      description:
        'Apoya al control de proyectos actualizando los cronogramas y las curvas de avance físico y financiero.',
    },
  ]
